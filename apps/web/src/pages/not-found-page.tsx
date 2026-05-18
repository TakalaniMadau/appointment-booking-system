import { Link } from "react-router-dom";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export const NotFoundPage = () => {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-2xl items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue-600">
            Route not found
          </p>
          <CardTitle>That page is not part of the booking flow yet.</CardTitle>
          <CardDescription>
            The booking experience lives on the home route for now, with the
            step-by-step branch flow handled inside the page itself.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/">Return to booking home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
