import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Welcome to&nbsp;</span>
          <span className={title({ color: "violet" })}>CineMax&nbsp;</span>
          <br />
          <span className={title()}>
            Your Ultimate Movie Experience
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            Watch the latest blockbusters in stunning quality
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              color: "primary", 
              radius: "full",
              variant: "shadow",
            })}
            href="/movies"
          >
            Now Showing
          </Link>
          <Link
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href="/coming-soon"
          >
            Coming Soon
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Featured movies would go here */}
          <div className="p-4 border rounded">Featured Movie 1</div>
          <div className="p-4 border rounded">Featured Movie 2</div>
          <div className="p-4 border rounded">Featured Movie 3</div>
        </div>
      </section>
    </DefaultLayout>
  );
}
