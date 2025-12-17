import React from "react";
import { Button } from "./Button";

export function ButtonExample() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">WindCtrl Button Examples</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Variants (Intent)</h2>
        <div className="flex gap-4 flex-wrap">
          <Button intent="primary">Primary</Button>
          <Button intent="secondary">Secondary</Button>
          <Button intent="destructive">Destructive</Button>
          <Button intent="outline">Outline</Button>
          <Button intent="ghost">Ghost</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Variants (Size)</h2>
        <div className="flex gap-4 items-center flex-wrap">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Traits</h2>
        <div className="flex gap-4 flex-wrap">
          <Button traits={["loading"]}>Loading (Array)</Button>
          <Button traits={{ loading: true, glass: false }}>
            Loading (Object)
          </Button>
          <Button traits={["glass"]}>Glass Effect</Button>
          <Button traits={["loading", "glass"]}>
            Loading + Glass
          </Button>
          <Button traits={["disabled"]}>Disabled</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Dynamic Props</h2>
        <div className="flex gap-4 flex-wrap">
          <Button w="full">Full Width (String)</Button>
          <Button w={200}>Fixed Width 200px</Button>
          <Button h={60}>Fixed Height 60px</Button>
          <Button w={150} h={50}>
            Custom Size
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Combinations</h2>
        <div className="flex gap-4 flex-wrap">
          <Button intent="secondary" size="lg" traits={["glass"]}>
            Secondary + Large + Glass
          </Button>
          <Button
            intent="primary"
            size="sm"
            traits={["loading"]}
            w={120}
          >
            Primary + Small + Loading
          </Button>
          <Button
            intent="outline"
            traits={["glass"]}
            w="full"
          >
            Outline + Glass + Full Width
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Default Variants</h2>
        <div className="flex gap-4 flex-wrap">
          <Button>Default (Primary + Medium)</Button>
          <Button size="lg">Only Size Override</Button>
          <Button intent="secondary">Only Intent Override</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Scopes (Context-aware styling)</h2>
        <div className="space-y-4">
          <div data-scope="header" className="group/wind-scope p-4 bg-gray-100 rounded">
            <p className="mb-2 text-sm text-gray-600">Header scope:</p>
            <Button intent="primary">Header Button</Button>
            <p className="mt-2 text-xs text-gray-500">
              This button will have smaller text due to header scope
            </p>
          </div>
          <div data-scope="footer" className="group/wind-scope p-4 bg-gray-100 rounded">
            <p className="mb-2 text-sm text-gray-600">Footer scope:</p>
            <Button intent="secondary">Footer Button</Button>
            <p className="mt-2 text-xs text-gray-500">
              This button will have extra small text due to footer scope
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

