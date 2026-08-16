import type { ComponentPropsWithoutRef, ReactNode } from "react";
import StaggeredMenu from "@/shared/components/navigation/StaggeredMenu";
import { navigationItems, socialLinks } from "@/shared/config/navigation";

type MainElementProps = Omit<ComponentPropsWithoutRef<"main">, "className" | "children">;

type PageShellProps = MainElementProps & {
  pageClassName: string;
  children: ReactNode;
  hideToggleAtTop?: boolean;
};

const PageShell = ({
  pageClassName,
  children,
  hideToggleAtTop = false,
  ...mainElementProps
}: PageShellProps) => {
  return (
    <main className={pageClassName} {...mainElementProps}>
      <StaggeredMenu items={navigationItems} socialItems={socialLinks} hideToggleAtTop={hideToggleAtTop} />
      {children}
    </main>
  );
};

export default PageShell;
