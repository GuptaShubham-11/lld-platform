export function FeedbackPreview() {
  const metrics = [
    { label: 'Class Design', value: 75, x: 50, y: 8, score: 70 },
    { label: 'SOLID', value: 70, x: 88, y: 38, score: 63 },
    { label: 'Extensibility', value: 71, x: 74, y: 82, score: 43 },
    { label: 'Trade-offs', value: 85, x: 26, y: 82, score: 50 },
    { label: 'Architecture', value: 78, x: 12, y: 38, score: 82 },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-space-heading text-base font-semibold text-foreground">
          AI Agent Evaluation
        </span>
      </div>

      {/* Radar */}
      <div className="relative mx-auto h-72 w-64">
        <RadarChart />

        {/* Labels */}
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium text-foreground"
            style={{
              left: `${metric.x}%`,
              top: `${metric.y}%`,
            }}
          >
            {metric.label}
            <br />({metric.score}/100)
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarChart() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="absolute inset-0 h-full w-full overflow-visible"
      fill="none"
    >
      {/* Outer geometry */}
      <polygon
        points="100,18 164,64 140,132 60,132 36,64"
        className="fill-background stroke-border"
        strokeWidth="1"
      />

      {/* Middle geometry */}
      <polygon
        points="100,43 141,70 126,112 74,112 59,70"
        className="stroke-border"
        strokeWidth="1"
      />

      {/* Inner geometry */}
      <polygon
        points="100,60 126,76 117,99 83,99 74,76"
        className="stroke-border"
        strokeWidth="1"
      />

      {/* Axis */}
      <path
        d="
                    M100 18 L100 132
                    M36 64 L164 64
                    M60 132 L140 132
                "
        className="stroke-border/60"
        strokeWidth="1"
      />

      {/* Actual score shape */}
      <polygon
        points="
                    100,30
                    154,69
                    131,119
                    65,112
                    48,68
                "
        className="stroke-primary"
        strokeWidth="1.5"
      />

      {/* Score points */}
      {[
        [100, 30],
        [154, 69],
        [131, 119],
        [65, 112],
        [48, 68],
      ].map(([cx, cy], index) => (
        <circle
          key={index}
          cx={cx}
          cy={cy}
          r="2.5"
          className="fill-background stroke-primary"
          strokeWidth="1.5"
        />
      ))}

      {/* Center */}
      <circle cx="100" cy="76" r="3" className="fill-primary" />
    </svg>
  );
}
