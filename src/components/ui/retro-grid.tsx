import { cn } from "@/lib/utils";

interface RetroGridProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  /** Rotation angle of the grid in degrees @default 65 */
  angle?: number;
  /** Grid cell size in pixels @default 60 */
  cellSize?: number;
  /** Grid opacity value between 0 and 1 @default 0.5 */
  opacity?: number;
  /** Grid line color in light mode @default "#f3f4f6" (Tailwind gray-100) */
  lightLineColor?: string;
  /** Grid line color in dark mode @default "#f3f4f6" (Tailwind gray-100) */
  darkLineColor?: string;
  /** ระยะเวลาหนึ่งรอบของแอนิเมชัน (วินาที) — ค่ายิ่งมาก = ช้าลง @default 24 */
  speedSec?: number;
}

export function RetroGrid({
  className,
  angle = 65,
  cellSize = 40,            // ตามที่คุณตั้งไว้
  opacity = 0.1,            // ตามที่คุณตั้งไว้
  lightLineColor = "#f3f4f6",
  darkLineColor = "#f3f4f6",
  speedSec = 24,            // <<— ปรับความเร็วที่นี่ (เช่น 12 = เร็วขึ้น, 40 = ช้าลง)
  ...props
}: RetroGridProps) {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
    "--grid-speed": `${speedSec}s`, // <<— ส่งเข้า animation-duration
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        "opacity-[var(--opacity)]",
        className,
      )}
      style={gridStyles}
      {...props}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className="
            animate-grid
            [animation-duration:var(--grid-speed)]           /* <<— คุมความเร็วด้วยพร็อพ */
            [animation-timing-function:linear]
            [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)]
            [background-repeat:repeat]
            [background-size:var(--cell-size)_var(--cell-size)]
            [height:300vh]
            [inset:0%_0px]
            [margin-left:-200%]
            [transform-origin:100%_0_0]
            [width:600vw]
            dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]
          "
        />
      </div>

      {/* โอเวอร์เลย์โทนเทาอ่อนให้ละมุนขึ้น */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-100/40 to-transparent to-90%" />
    </div>
  );
}
