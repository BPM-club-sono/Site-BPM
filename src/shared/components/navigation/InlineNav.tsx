import { NavLink } from "react-router-dom";
import { navigationItems } from "@/shared/config/navigation";
import { isExternalHref } from "@/shared/lib/url/isExternalHref";
import "./InlineNav.css";

type InlineNavProps = {
  className?: string;
};

const InlineNav = ({ className }: InlineNavProps) => {
  return (
    <nav className={["inline-nav", className].filter(Boolean).join(" ")} aria-label="Navigation principale">
      {navigationItems.map((item, index) =>
        item.isExternal || isExternalHref(item.href) ? (
          <a
            key={`${item.label}-${index}`}
            className="inline-nav__link"
            href={item.href}
            aria-label={item.ariaLabel}
          >
            {item.label}
          </a>
        ) : (
          <NavLink
            key={`${item.label}-${index}`}
            className="inline-nav__link"
            to={item.href}
            aria-label={item.ariaLabel}
            end
          >
            {item.label}
          </NavLink>
        )
      )}
    </nav>
  );
};

export default InlineNav;
