import { useEffect, useRef } from "react";

type Vertex = { x: number; y: number; z: number };
type ScreenPoint = { x: number; y: number; depth: number };
type Segment = [Vertex, Vertex];

const loss = (x: number, z: number) =>
  0.1 * (x * x + z * z) +
  0.23 * Math.sin(2.05 * x + 0.25) * Math.cos(1.72 * z - 0.2) +
  0.12 * Math.sin(3.2 * (x + z)) -
  0.72 * Math.exp(-((x - 0.56) ** 2 + (z - 0.38) ** 2) * 1.75) -
  0.3 * Math.exp(-((x + 0.98) ** 2 + (z + 0.72) ** 2) * 2.55) +
  0.18 * Math.exp(-((x + 0.66) ** 2 + (z - 0.96) ** 2) * 3.05);

const gradientAt = (x: number, z: number) => {
  const e = 0.002;
  return {
    x: (loss(x + e, z) - loss(x - e, z)) / (2 * e),
    z: (loss(x, z + e) - loss(x, z - e)) / (2 * e),
  };
};

const interpolateLevel = (a: Vertex, b: Vertex, level: number): Vertex => {
  const denominator = b.y - a.y;
  const t = Math.abs(denominator) < 1e-6 ? 0.5 : (level - a.y) / denominator;
  return { x: a.x + (b.x - a.x) * t, y: level, z: a.z + (b.z - a.z) * t };
};

export function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gridSize = 17;
    const xMin = 0;
    const zMin = 0;
    const xMax = 3.35;
    const zMax = 3.35;
    const vertices: Vertex[] = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = xMin + (row / (gridSize - 1)) * (xMax - xMin);
        const z = zMin + (col / (gridSize - 1)) * (zMax - zMin);
        vertices.push({ x, y: loss(x - 1.45, z - 1.45), z });
      }
    }

    const values = vertices.map(vertex => vertex.y);
    const minLoss = Math.min(...values);
    const maxLoss = Math.max(...values);
    const floorY = minLoss - 0.44;
    const topY = maxLoss + 0.56;

    const path: Vertex[] = [];
    let px = 3.02;
    let pz = 2.86;
    for (let i = 0; i < 82; i++) {
      path.push({ x: px, y: loss(px - 1.45, pz - 1.45) + 0.035, z: pz });
      const gradient = gradientAt(px - 1.45, pz - 1.45);
      const norm = Math.max(0.001, Math.hypot(gradient.x, gradient.z));
      const wobble = 0.026 * Math.exp(-i / 18) * Math.sin(i * 1.48);
      px -= 0.068 * gradient.x - wobble * (gradient.z / norm);
      pz -= 0.068 * gradient.z + wobble * (gradient.x / norm);
    }

    const contourLevels = [-0.34, -0.04, 0.24, 0.54, 0.88];
    const contours: Array<{ level: number; segments: Segment[] }> = contourLevels.map(level => {
      const segments: Segment[] = [];
      for (let row = 0; row < gridSize - 1; row++) {
        for (let col = 0; col < gridSize - 1; col++) {
          const p0 = vertices[row * gridSize + col]!;
          const p1 = vertices[(row + 1) * gridSize + col]!;
          const p2 = vertices[(row + 1) * gridSize + col + 1]!;
          const p3 = vertices[row * gridSize + col + 1]!;
          const sides: [Vertex, Vertex][] = [[p0, p1], [p1, p2], [p2, p3], [p3, p0]];
          const hits: Vertex[] = [];
          for (const [a, b] of sides) {
            const da = a.y - level;
            const db = b.y - level;
            if ((da < 0 && db > 0) || (da > 0 && db < 0)) hits.push(interpolateLevel(a, b, level));
          }
          if (hits.length === 2) segments.push([hits[0]!, hits[1]!]);
          if (hits.length === 4) {
            const center = (p0.y + p1.y + p2.y + p3.y) / 4;
            if (center > level) segments.push([hits[0]!, hits[1]!], [hits[2]!, hits[3]!]);
            else segments.push([hits[0]!, hits[3]!], [hits[1]!, hits[2]!]);
          }
        }
      }
      return { level, segments };
    });

    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let hoverStrength = 0;

    let yaw = -0.98;
    let pitch = 0.52;
    let targetYaw = yaw;
    let targetPitch = pitch;
    let dragging = false;
    let dragPointerId: number | null = null;
    let dragX = 0;
    let dragY = 0;
    let dragYaw = yaw;
    let dragPitch = pitch;
    let lastInteraction = performance.now();

    const pointer = { x: 0, y: 0, inside: false };
    const minYaw = -1.34;
    const maxYaw = -0.22;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.inside = true;
    };

    const pointerEnter = (event: PointerEvent) => updatePointer(event);
    const pointerLeave = () => {
      if (!dragging) pointer.inside = false;
    };
    const pointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      updatePointer(event);
      dragging = true;
      dragPointerId = event.pointerId;
      dragX = event.clientX;
      dragY = event.clientY;
      dragYaw = targetYaw;
      dragPitch = targetPitch;
      lastInteraction = performance.now();
      host.setPointerCapture?.(event.pointerId);
    };
    const pointerMove = (event: PointerEvent) => {
      updatePointer(event);
      if (!dragging || dragPointerId !== event.pointerId) return;
      const dx = event.clientX - dragX;
      const dy = event.clientY - dragY;
      targetYaw = clamp(dragYaw + dx * 0.0065, minYaw, maxYaw);
      targetPitch = Math.max(0.34, Math.min(0.74, dragPitch + dy * 0.0042));
      lastInteraction = performance.now();
    };
    const endDrag = (event: PointerEvent) => {
      if (dragPointerId !== event.pointerId) return;
      dragging = false;
      dragPointerId = null;
      lastInteraction = performance.now();
      if (!host.matches(":hover")) pointer.inside = false;
      try { host.releasePointerCapture?.(event.pointerId); } catch {}
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible || width === 0 || height === 0) return;

      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;
      const ease = reduced ? 1 : 1 - Math.exp(-dt * 9);
      hoverStrength += ((pointer.inside && !dragging ? 1 : 0) - hoverStrength) * ease;

      if (!dragging && !reduced && now - lastInteraction > 1000) {
        targetYaw = clamp(-0.98 + Math.sin(now * 0.00034) * 0.13, minYaw, maxYaw);
        targetPitch = 0.52 + Math.cos(now * 0.00024) * 0.006;
      }

      yaw += (targetYaw - yaw) * (reduced ? 1 : Math.min(1, dt * 11));
      pitch += (targetPitch - pitch) * (reduced ? 1 : Math.min(1, dt * 11));

      ctx.clearRect(0, 0, width, height);

      const scale = Math.min(width, height) * 0.178;
      // Keep the complete 3D surface visually centered in the left hero panel.
      const cx = width * 0.485;
      const cy = height * 0.515;

      const centerX = (xMin + xMax) / 2;
      const centerZ = (zMin + zMax) / 2;

      const project = (vertex: Vertex): ScreenPoint => {
        const vx = vertex.x - centerX;
        const vz = vertex.z - centerZ;
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        const x1 = vx * cosY - vz * sinY;
        const z1 = vx * sinY + vz * cosY;

        const cosX = Math.cos(pitch);
        const sinX = Math.sin(pitch);
        const y2 = vertex.y * cosX - z1 * sinX;
        const z2 = vertex.y * sinX + z1 * cosX;

        const perspective = 1 / Math.max(0.985, 1 + z2 * 0.0022);
        return {
          x: cx + x1 * scale * perspective,
          y: cy - y2 * scale * perspective,
          depth: z2,
        };
      };

      const line = (a: Vertex, b: Vertex, stroke: string, lineWidth = 0.7, dash: number[] = []) => {
        const p = project(a);
        const q = project(b);
        ctx.save();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash(dash);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
        ctx.restore();
      };

      const xTicks = 4;
      const zTicks = 4;
      for (let i = 0; i <= xTicks; i++) {
        const x = xMin + (i / xTicks) * (xMax - xMin);
        const alpha = i === 0 ? 0.18 : 0.055;
        line({ x, y: floorY, z: zMin }, { x, y: floorY, z: zMax }, `rgba(0, 112, 78, ${alpha})`, i === 0 ? 0.95 : 0.55);
      }
      for (let i = 0; i <= zTicks; i++) {
        const z = zMin + (i / zTicks) * (zMax - zMin);
        const alpha = i === 0 ? 0.18 : 0.055;
        line({ x: xMin, y: floorY, z }, { x: xMax, y: floorY, z }, `rgba(0, 112, 78, ${alpha})`, i === 0 ? 0.95 : 0.55);
      }

      line({ x: xMin, y: floorY, z: zMin }, { x: xMax, y: floorY, z: zMin }, "rgba(0, 103, 72, 0.20)", 0.9);
      line({ x: xMin, y: floorY, z: zMin }, { x: xMin, y: floorY, z: zMax }, "rgba(0, 103, 72, 0.20)", 0.9);
      line({ x: xMin, y: floorY, z: zMin }, { x: xMin, y: topY, z: zMin }, "rgba(0, 103, 72, 0.20)", 0.9);

      contours.forEach(({ segments }, levelIndex) => {
        const useIndigo = levelIndex % 3 === 1;
        const alpha = 0.09 + hoverStrength * (0.055 + levelIndex * 0.008);
        ctx.strokeStyle = useIndigo ? `rgba(111, 121, 245, ${alpha * 0.92})` : `rgba(17, 117, 83, ${alpha})`;
        ctx.lineWidth = hoverStrength > 0.1 ? 0.95 : 0.62;
        ctx.beginPath();
        for (const [a, b] of segments) {
          const p = project({ ...a, y: floorY + 0.02 });
          const q = project({ ...b, y: floorY + 0.02 });
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
        }
        ctx.stroke();
      });

      const rows: Array<{ points: ScreenPoint[]; depth: number; major: boolean; kind: "row" | "col"; index: number }> = [];
      for (let row = 0; row < gridSize; row++) {
        const rowPoints = Array.from({ length: gridSize }, (_, col) => project(vertices[row * gridSize + col]!));
        rows.push({ points: rowPoints, depth: rowPoints.reduce((sum, point) => sum + point.depth, 0) / gridSize, major: row % 4 === 0, kind: "row", index: row });
      }
      for (let col = 0; col < gridSize; col++) {
        const colPoints = Array.from({ length: gridSize }, (_, row) => project(vertices[row * gridSize + col]!));
        rows.push({ points: colPoints, depth: colPoints.reduce((sum, point) => sum + point.depth, 0) / gridSize, major: col % 4 === 0, kind: "col", index: col });
      }
      rows.sort((a, b) => a.depth - b.depth).forEach(row => {
        const indigoAccent = row.kind === "col" && row.major && row.index % 8 === 0;
        ctx.strokeStyle = indigoAccent
          ? "rgba(101, 125, 255, 0.42)"
          : row.major ? "rgba(0, 126, 87, 0.34)" : "rgba(0, 126, 87, 0.13)";
        ctx.lineWidth = row.major ? 1.05 : 0.58;
        ctx.beginPath();
        row.points.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      });

      const projectedVertices = vertices.map(project);
      let nearestIndex = -1;
      let nearestDistance = Number.POSITIVE_INFINITY;
      if (pointer.inside && !dragging) {
        projectedVertices.forEach((point, index) => {
          const d = (point.x - pointer.x) ** 2 + (point.y - pointer.y) ** 2;
          if (d < nearestDistance) {
            nearestDistance = d;
            nearestIndex = index;
          }
        });
      }

      if (nearestIndex >= 0 && hoverStrength > 0.02) {
        const row = Math.floor(nearestIndex / gridSize);
        const col = nearestIndex % gridSize;
        const selected = vertices[nearestIndex]!;
        const selectedPoint = project(selected);
        const floorPoint = project({ x: selected.x, y: floorY, z: selected.z });

        const drawSlice = (slice: Vertex[], stroke: string) => {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          slice.forEach((vertex, index) => {
            const point = project({ ...vertex, y: vertex.y + 0.02 });
            if (index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        };
        drawSlice(Array.from({ length: gridSize }, (_, c) => vertices[row * gridSize + c]!), `rgba(0, 116, 79, ${0.34 + hoverStrength * 0.5})`);
        drawSlice(Array.from({ length: gridSize }, (_, r) => vertices[r * gridSize + col]!), `rgba(111, 121, 245, ${0.28 + hoverStrength * 0.46})`);

        ctx.save();
        ctx.setLineDash([4, 5]);
        ctx.strokeStyle = `rgba(13, 91, 67, ${0.26 + hoverStrength * 0.34})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(selectedPoint.x, selectedPoint.y);
        ctx.lineTo(floorPoint.x, floorPoint.y);
        ctx.stroke();
        ctx.restore();

        const gradient = gradientAt(selected.x - 1.45, selected.z - 1.45);
        const norm = Math.max(0.001, Math.hypot(gradient.x, gradient.z));
        const arrowEnd = project({
          x: selected.x - (gradient.x / norm) * 0.42,
          y: selected.y + 0.035,
          z: selected.z - (gradient.z / norm) * 0.42,
        });
        const dx = arrowEnd.x - selectedPoint.x;
        const dy = arrowEnd.y - selectedPoint.y;
        const screenNorm = Math.max(1, Math.hypot(dx, dy));
        const ux = dx / screenNorm;
        const uy = dy / screenNorm;
        ctx.strokeStyle = `rgba(111, 121, 245, ${0.35 + hoverStrength * 0.45})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(selectedPoint.x, selectedPoint.y);
        ctx.lineTo(arrowEnd.x, arrowEnd.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(arrowEnd.x, arrowEnd.y);
        ctx.lineTo(arrowEnd.x - ux * 6 - uy * 3.5, arrowEnd.y - uy * 6 + ux * 3.5);
        ctx.moveTo(arrowEnd.x, arrowEnd.y);
        ctx.lineTo(arrowEnd.x - ux * 6 + uy * 3.5, arrowEnd.y - uy * 6 - ux * 3.5);
        ctx.stroke();

        ctx.fillStyle = "rgba(0, 151, 101, 0.96)";
        ctx.fillRect(selectedPoint.x - 2.6, selectedPoint.y - 2.6, 5.2, 5.2);

        ctx.font = '500 10px "Google Sans Code", monospace';
        ctx.fillStyle = `rgba(13, 91, 67, ${0.4 + hoverStrength * 0.42})`;
        const labelX = Math.min(width - 128, Math.max(12, selectedPoint.x + 12));
        const labelY = Math.min(height - 18, Math.max(18, selectedPoint.y - 12));
        ctx.fillText(`L(θ) = ${selected.y.toFixed(2)}`, labelX, labelY);
        ctx.fillStyle = `rgba(111, 121, 245, ${0.38 + hoverStrength * 0.42})`;
        ctx.fillText(`−∇L`, labelX, labelY + 14);
      }

      const projectedPath = path.map(project);
      ctx.save();
      ctx.strokeStyle = "rgba(101, 125, 255, 0.92)";
      ctx.lineWidth = 3.6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(101, 125, 255, 0.14)";
      ctx.shadowBlur = 5;
      ctx.beginPath();
      projectedPath.forEach((point, index) => index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y));
      ctx.stroke();
      ctx.restore();

      [18, 42, 63].forEach(index => {
        const point = projectedPath[index]!;
        ctx.fillStyle = "rgba(101, 125, 255, 0.92)";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      [0, 16, 35, 55, 81].forEach((index, checkpoint) => {
        const point = projectedPath[index]!;
        const size = checkpoint === 0 || checkpoint === 4 ? 6 : 4.5;
        ctx.fillStyle = checkpoint === 4 ? "rgba(0, 82, 58, 1)" : "rgba(0, 134, 91, 0.98)";
        ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
      });
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      last = performance.now();
    });
    visibilityObserver.observe(host);

    host.addEventListener("pointerenter", pointerEnter);
    host.addEventListener("pointerleave", pointerLeave);
    host.addEventListener("pointerdown", pointerDown);
    host.addEventListener("pointermove", pointerMove);
    host.addEventListener("pointerup", endDrag);
    host.addEventListener("pointercancel", endDrag);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      host.removeEventListener("pointerenter", pointerEnter);
      host.removeEventListener("pointerleave", pointerLeave);
      host.removeEventListener("pointerdown", pointerDown);
      host.removeEventListener("pointermove", pointerMove);
      host.removeEventListener("pointerup", endDrag);
      host.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  return (
    <div className="neural-field loss-field" aria-label="Bề mặt hàm mất mát 3D tương tác. Giữ và kéo để xoay góc nhìn; di chuột để xem lát cắt và hướng gradient.">
      <canvas ref={canvasRef} className="h-full w-full" />
      <span className="formula formula-a">L(θ)</span>
      <span className="formula formula-b">θ₁ · θ₂</span>
      <span className="formula formula-c">θ₀ → θ*</span>
    </div>
  );
}
