import { ModeToggle } from "@/components/modeToggle";

interface ColorSwatch {
  name: string;
  variable: string;
  description?: string;
}

const colorSwatches: ColorSwatch[] = [
  { name: "Background", variable: "background", description: "Main background color" },
  { name: "Foreground", variable: "foreground", description: "Main text color" },
  { name: "Card", variable: "card", description: "Card background color" },
  { name: "Card Foreground", variable: "card-foreground", description: "Card text color" },
  { name: "Popover", variable: "popover", description: "Popover background color" },
  { name: "Popover Foreground", variable: "popover-foreground", description: "Popover text color" },
  { name: "Primary", variable: "primary", description: "Primary brand color" },
  { name: "Primary Foreground", variable: "primary-foreground", description: "Text on primary color" },
  { name: "Secondary", variable: "secondary", description: "Secondary brand color" },
  { name: "Secondary Foreground", variable: "secondary-foreground", description: "Text on secondary color" },
  { name: "Muted", variable: "muted", description: "Muted background color" },
  { name: "Muted Foreground", variable: "muted-foreground", description: "Muted text color" },
  { name: "Accent", variable: "accent", description: "Accent color" },
  { name: "Accent Foreground", variable: "accent-foreground", description: "Text on accent color" },
  { name: "Destructive", variable: "destructive", description: "Error/destructive color" },
  { name: "Border", variable: "border", description: "Border color" },
  { name: "Input", variable: "input", description: "Input border color" },
  { name: "Ring", variable: "ring", description: "Focus ring color" },
];

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Color Palette</h1>
          <ModeToggle />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colorSwatches.map((swatch) => (
            <div
              key={swatch.variable}
              className="rounded-lg overflow-hidden border border-border"
            >
              <div
                className="h-32 flex items-center justify-center"
                style={{ backgroundColor: `var(--${swatch.variable})` }}
              >
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `var(--${swatch.variable}-foreground)`,
                    color: `var(--${swatch.variable})`,
                  }}
                >
                  Sample Text
                </span>
              </div>
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-card-foreground">{swatch.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {swatch.description}
                </p>
                <div className="mt-2 text-sm font-mono text-muted-foreground">
                  var(--{swatch.variable})
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-lg border border-border bg-card">
          <h2 className="text-xl font-semibold mb-4">How to use these colors</h2>
          <p className="text-muted-foreground mb-4">
            These colors are available as CSS variables and can be used in your components using Tailwind classes or direct CSS.
          </p>
          <div className="bg-muted p-4 rounded-md">
            <pre className="text-sm font-mono text-muted-foreground">
              {`// Using Tailwind classes
<div className="bg-primary text-primary-foreground">
  Primary colored element
</div>

// Using CSS variables
.element {
  background-color: var(--primary);
  color: var(--primary-foreground);
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
