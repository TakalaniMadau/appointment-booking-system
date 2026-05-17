import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Select } from "./components/ui/select";

const App = () => {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-brand-navy-100/80 bg-white/80">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-red-500">
                Frontend Foundation
              </p>
              <CardTitle className="max-w-2xl">
                Tailwind is wired up for a calm, guided booking experience.
              </CardTitle>
              <CardDescription className="max-w-xl">
                These primitives are ready to support the real appointment flow,
                validation states, and shared DTO-driven forms.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  className="mb-2 block text-sm font-medium text-brand-navy-900"
                  htmlFor="branch"
                >
                  Preferred branch
                </label>
                <Select defaultValue="" id="branch">
                  <option disabled value="">
                    Choose a branch
                  </option>
                  <option>Sandton City</option>
                  <option>Rosebank Mall</option>
                  <option>Cape Town Foreshore</option>
                </Select>
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-brand-navy-900"
                  htmlFor="full-name"
                >
                  Full name
                </label>
                <Input id="full-name" placeholder="Jane Doe" />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-brand-navy-900"
                  htmlFor="phone"
                >
                  Phone number
                </label>
                <Input id="phone" placeholder="+27 82 123 4567" />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-brand-navy-900"
                  htmlFor="appointment-date"
                >
                  Appointment date
                </label>
                <Input id="appointment-date" type="date" />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-brand-navy-900"
                  htmlFor="service"
                >
                  Service type
                </label>
                <Select id="service">
                  <option>Account support</option>
                  <option>Card collection</option>
                  <option>Document verification</option>
                </Select>
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-3 pt-1">
                <Button>Check availability</Button>
                <Button variant="secondary">View booking</Button>
                <Button variant="ghost">Preview empty state</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Design language</CardTitle>
                <CardDescription>
                  Tokens lean on the brand red and deep navy from the favicon,
                  then soften the layout with light cloud surfaces.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-card border border-brand-red-100 bg-brand-red-50 p-4">
                    <div className="h-10 rounded-pill bg-brand-red-500" />
                    <p className="mt-3 text-sm font-medium text-brand-navy-900">
                      Accent
                    </p>
                  </div>
                  <div className="rounded-card border border-brand-navy-100 bg-brand-navy-50 p-4">
                    <div className="h-10 rounded-pill bg-brand-navy-700" />
                    <p className="mt-3 text-sm font-medium text-brand-navy-900">
                      Trust
                    </p>
                  </div>
                  <div className="rounded-card border border-cloud-200 bg-sand-100 p-4">
                    <div className="h-10 rounded-pill bg-cloud-200" />
                    <p className="mt-3 text-sm font-medium text-brand-navy-900">
                      Surface
                    </p>
                  </div>
                </div>
                <div className="rounded-card border border-brand-navy-100/80 bg-cloud-50 p-4">
                  <p className="text-sm font-semibold text-brand-navy-900">
                    Ready next
                  </p>
                  <p className="mt-2 text-sm leading-6 text-brand-navy-700">
                    Branch selection, live slot availability, optimistic loading
                    states, and schema-driven error messaging can now plug into
                    a consistent UI baseline.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Field states</CardTitle>
                <CardDescription>
                  Inputs and selects share focus treatment, spacing, and error
                  affordances.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-brand-navy-900"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <Input id="email" invalid placeholder="name@example.com" />
                  <p className="mt-2 text-sm text-brand-red-600">
                    Use the invalid state when a shared Zod schema rejects a
                    field.
                  </p>
                </div>
                <Button className="w-full" size="lg" variant="quiet">
                  Send confirmation preview
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
};

export default App;
