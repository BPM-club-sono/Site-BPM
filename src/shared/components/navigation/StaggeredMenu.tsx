import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Link, NavLink } from "react-router-dom";
import { gsap } from "gsap";
import type { NavigationItem, SocialLink } from "@/shared/types/navigation";
import "./StaggeredMenu.css";

type StaggeredMenuProps = {
  position?: "left" | "right";
  colors?: string[];
  items?: NavigationItem[];
  socialItems?: SocialLink[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  isFixed?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
};

const FALLBACK_LAYER_COLORS = ["#111111", "#ffffff"];

const isExternalHref = (href: string) => {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:");
};

const toLayerColors = (colors?: string[]) => {
  const layerColors = colors && colors.length > 0 ? colors.slice(0, 4) : FALLBACK_LAYER_COLORS;

  if (layerColors.length < 3) {
    return layerColors;
  }

  const middleIndex = Math.floor(layerColors.length / 2);
  return layerColors.filter((_, index) => index !== middleIndex);
};

const StaggeredMenu = ({
  position = "right",
  colors = ["#111111", "#ffffff"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  menuButtonColor = "#fff",
  openMenuButtonColor = "#000",
  accentColor = "#000000",
  changeMenuColorOnOpen = true,
  isFixed = true,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose
}: StaggeredMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toggleTextLines, setToggleTextLines] = useState(["Menu", "Close"]);

  const openRef = useRef(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersContainerRef = useRef<HTMLDivElement | null>(null);
  const preLayerElementsRef = useRef<HTMLDivElement[]>([]);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  const openTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const textTweenRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);
  const isAnimatingRef = useRef(false);

  const layerColors = toLayerColors(colors);

  // ----- GSAP setup -----
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const panel = panelRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      const layerContainer = preLayersContainerRef.current;

      if (!panel || !icon || !textInner) {
        return;
      }

      preLayerElementsRef.current = layerContainer
        ? Array.from(layerContainer.querySelectorAll<HTMLDivElement>(".sm-prelayer"))
        : [];

      const offscreenPercent = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayerElementsRef.current], { xPercent: offscreenPercent });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });

      if (toggleButtonRef.current) {
        gsap.set(toggleButtonRef.current, { color: menuButtonColor });
      }
    });

    return () => {
      context.revert();
    };
  }, [menuButtonColor, position, layerColors.length]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElementsRef.current;

    if (!panel) {
      return null;
    }

    openTimelineRef.current?.kill();

    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemLabels = Array.from(panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel"));
    const numberedItems = Array.from(
      panel.querySelectorAll<HTMLElement>(".sm-panel-list[data-numbering] .sm-panel-item")
    );
    const socialTitle = panel.querySelector<HTMLElement>(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll<HTMLElement>(".sm-socials-link"));

    const layerStates = layers.map((layer) => ({
      layer,
      startPercent: Number(gsap.getProperty(layer, "xPercent"))
    }));
    const panelStartPercent = Number(gsap.getProperty(panel, "xPercent"));

    if (itemLabels.length > 0) {
      gsap.set(itemLabels, { yPercent: 140, rotate: 10 });
    }

    if (numberedItems.length > 0) {
      gsap.set(numberedItems, { "--sm-num-opacity": 0 });
    }

    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0 });
    }

    if (socialLinks.length > 0) {
      gsap.set(socialLinks, { y: 25, opacity: 0 });
    }

    const timeline = gsap.timeline({ paused: true });

    layerStates.forEach(({ layer, startPercent }, index) => {
      timeline.fromTo(
        layer,
        { xPercent: startPercent },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        index * 0.07
      );
    });

    const lastLayerInsertTime = layerStates.length > 0 ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastLayerInsertTime + (layerStates.length > 0 ? 0.08 : 0);
    const panelDuration = 0.65;

    timeline.fromTo(
      panel,
      { xPercent: panelStartPercent },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    if (itemLabels.length > 0) {
      const itemsInsertTime = panelInsertTime + panelDuration * 0.15;

      timeline.to(
        itemLabels,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" }
        },
        itemsInsertTime
      );

      if (numberedItems.length > 0) {
        timeline.to(
          numberedItems,
          {
            duration: 0.6,
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" }
          },
          itemsInsertTime + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length > 0) {
      const socialsInsertTime = panelInsertTime + panelDuration * 0.4;

      if (socialTitle) {
        timeline.to(
          socialTitle,
          {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
          },
          socialsInsertTime
        );
      }

      if (socialLinks.length > 0) {
        timeline.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: "opacity" });
            }
          },
          socialsInsertTime + 0.04
        );
      }
    }

    openTimelineRef.current = timeline;
    return timeline;
  }, []);

  const playOpen = useCallback(() => {
    if (isAnimatingRef.current) {
      return;
    }

    isAnimatingRef.current = true;

    const timeline = buildOpenTimeline();
    if (!timeline) {
      isAnimatingRef.current = false;
      return;
    }

    timeline.eventCallback("onComplete", () => {
      isAnimatingRef.current = false;
    });

    timeline.play(0);
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTimelineRef.current?.kill();
    openTimelineRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElementsRef.current;

    if (!panel) {
      return;
    }

    closeTweenRef.current?.kill();

    const offscreenPercent = position === "left" ? -100 : 100;
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: offscreenPercent,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemLabels = Array.from(panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel"));
        const numberedItems = Array.from(
          panel.querySelectorAll<HTMLElement>(".sm-panel-list[data-numbering] .sm-panel-item")
        );
        const socialTitle = panel.querySelector<HTMLElement>(".sm-socials-title");
        const socialLinks = Array.from(panel.querySelectorAll<HTMLElement>(".sm-socials-link"));

        if (itemLabels.length > 0) {
          gsap.set(itemLabels, { yPercent: 140, rotate: 10 });
        }

        if (numberedItems.length > 0) {
          gsap.set(numberedItems, { "--sm-num-opacity": 0 });
        }

        if (socialTitle) {
          gsap.set(socialTitle, { opacity: 0 });
        }

        if (socialLinks.length > 0) {
          gsap.set(socialLinks, { y: 25, opacity: 0 });
        }

        isAnimatingRef.current = false;
      }
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    if (!iconRef.current) {
      return;
    }

    spinTweenRef.current?.kill();
    spinTweenRef.current = gsap.to(iconRef.current, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease: opening ? "power4.out" : "power3.inOut",
      overwrite: "auto"
    });
  }, []);

  const animateToggleButtonColor = useCallback(
    (opening: boolean) => {
      const button = toggleButtonRef.current;
      if (!button) {
        return;
      }

      colorTweenRef.current?.kill();

      if (!changeMenuColorOnOpen) {
        gsap.set(button, { color: menuButtonColor });
        return;
      }

      colorTweenRef.current = gsap.to(button, {
        color: opening ? openMenuButtonColor : menuButtonColor,
        delay: 0.18,
        duration: 0.3,
        ease: "power2.out"
      });
    },
    [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]
  );

  useEffect(() => {
    if (!toggleButtonRef.current) {
      return;
    }

    if (!changeMenuColorOnOpen) {
      gsap.set(toggleButtonRef.current, { color: menuButtonColor });
      return;
    }

    gsap.set(toggleButtonRef.current, {
      color: openRef.current ? openMenuButtonColor : menuButtonColor
    });
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateToggleText = useCallback((opening: boolean) => {
    const textInner = textInnerRef.current;
    if (!textInner) {
      return;
    }

    textTweenRef.current?.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";

    const sequence = [currentLabel];
    let previousLabel = currentLabel;

    for (let index = 0; index < 3; index += 1) {
      previousLabel = previousLabel === "Menu" ? "Close" : "Menu";
      sequence.push(previousLabel);
    }

    if (previousLabel !== targetLabel) {
      sequence.push(targetLabel);
    }

    sequence.push(targetLabel);
    setToggleTextLines(sequence);

    gsap.set(textInner, { yPercent: 0 });

    const finalShiftPercent = ((sequence.length - 1) / sequence.length) * 100;
    textTweenRef.current = gsap.to(textInner, {
      yPercent: -finalShiftPercent,
      duration: 0.5 + sequence.length * 0.07,
      ease: "power4.out"
    });
  }, []);

  const closeMenu = useCallback(() => {
    if (!openRef.current) {
      return;
    }

    openRef.current = false;
    setIsOpen(false);

    onMenuClose?.();
    playClose();
    animateIcon(false);
    animateToggleButtonColor(false);
    animateToggleText(false);
  }, [animateIcon, animateToggleButtonColor, animateToggleText, onMenuClose, playClose]);

  const toggleMenu = useCallback(() => {
    const targetOpenState = !openRef.current;
    openRef.current = targetOpenState;
    setIsOpen(targetOpenState);

    if (targetOpenState) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(targetOpenState);
    animateToggleButtonColor(targetOpenState);
    animateToggleText(targetOpenState);
  }, [
    animateIcon,
    animateToggleButtonColor,
    animateToggleText,
    onMenuClose,
    onMenuOpen,
    playClose,
    playOpen
  ]);

  // ----- Dismiss handlers -----
  useEffect(() => {
    if (!closeOnClickAway || !isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;

      if (
        panelRef.current &&
        !panelRef.current.contains(targetNode) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(targetNode)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeOnClickAway, closeMenu, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [closeMenu, isOpen]);

  const handleMenuItemClick = () => {
    closeMenu();
  };

  return (
    <div
      className={[className, "staggered-menu-wrapper", isFixed ? "fixed-wrapper" : ""]
        .filter(Boolean)
        .join(" ")}
      style={accentColor ? ({ "--sm-accent": accentColor } as CSSProperties) : undefined}
      data-position={position}
      data-open={isOpen || undefined}
    >
      <div ref={preLayersContainerRef} className="sm-prelayers" aria-hidden="true">
        {layerColors.map((backgroundColor, index) => (
          <div
            key={`${backgroundColor}-${index}`}
            className="sm-prelayer"
            style={{ background: backgroundColor }}
          />
        ))}
      </div>

      <header className="staggered-menu-header" aria-label="Main navigation header">
        <nav className="sm-desktop-nav" aria-label="Navigation principale">
          {items.map((item, index) =>
            item.isExternal || isExternalHref(item.href) ? (
              <a
                key={`desktop-${item.label}-${index}`}
                className="sm-desktop-nav-link"
                href={item.href}
                aria-label={item.ariaLabel}
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={`desktop-${item.label}-${index}`}
                className="sm-desktop-nav-link"
                to={item.href}
                aria-label={item.ariaLabel}
                end
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <button
          ref={toggleButtonRef}
          className="sm-toggle"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
          type="button"
        >
          <span className="sm-toggle-textWrap" aria-hidden="true">
            <span ref={textInnerRef} className="sm-toggle-textInner">
              {toggleTextLines.map((line, index) => (
                <span className="sm-toggle-line" key={`${line}-${index}`}>
                  {line}
                </span>
              ))}
            </span>
          </span>

          <span ref={iconRef} className="sm-icon" aria-hidden="true">
            <span className="sm-icon-line" />
            <span className="sm-icon-line sm-icon-line-v" />
          </span>
        </button>
      </header>

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!isOpen}>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items.length > 0 ? (
              items.map((item, index) => (
                <li className="sm-panel-itemWrap" key={`${item.label}-${index}`}>
                  {item.isExternal || isExternalHref(item.href) ? (
                    <a
                      className="sm-panel-item"
                      href={item.href}
                      aria-label={item.ariaLabel}
                      data-index={index + 1}
                      onClick={handleMenuItemClick}
                    >
                      <span className="sm-panel-itemLabel">{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      className="sm-panel-item"
                      to={item.href}
                      aria-label={item.ariaLabel}
                      data-index={index + 1}
                      onClick={handleMenuItemClick}
                    >
                      <span className="sm-panel-itemLabel">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>

          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Nous retrouver</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((socialItem, index) => (
                  <li key={`${socialItem.label}-${index}`} className="sm-socials-item">
                    <a
                      href={socialItem.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm-socials-link"
                      onClick={handleMenuItemClick}
                    >
                      {socialItem.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenu;
