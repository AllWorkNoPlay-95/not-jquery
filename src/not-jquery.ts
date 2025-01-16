class NotJQuery {
  elements: NodeListOf<Element> | Array<Window | Document> | any;

  constructor(selector: string | Element | Window | Document) {
    this.elements = null;
    if (selector === window || selector === document) {
      // Handle the window object explicitly
      this.elements = [selector];
    } else if (typeof selector === "string") {
      this.elements = document.querySelectorAll(selector);
    } else {
      console.error(`Element ${selector} not compatible!`);
    }
    console.log("Elements: ", this.elements);
  }

  private assertElement(element?: any, action?: string): boolean {
    let length = 0;

    if (!element) element = this.elements;

    if (Array.isArray(element)) {
      length = element.length;
    } else length = 1;

    for (let i = 0, len = length; i < len; i++) {
      if (!(element instanceof Element)) {
        console.warn(
          `Cannot ${action && "()" || "do that"}, ${typeof element} (${element}) is not supported!`
        );
        return false;
      }
    }
    return true;
  }

  //region Emulations
  public addClass(className: string): NotJQuery {
    for (let i = 0, len = this.elements.length; i < len; i++) {
      let el = this.elements[i];
      if (!this.assertElement(el, "addClass")) continue;
      el.classList.add(className);
    }
    return this;
  }

  public removeClass(className: string): NotJQuery {
    if (!this.assertElement(null, "removeClass")) return this;
    this.elements.forEach((el: Element) => el.classList.remove(className));
    return this;
  }

  public html(htmlContent?: string): string | NotJQuery {
    if (!this.assertElement(null, "html")) return this;
    if (htmlContent === undefined) {
      return this.elements[0]?.innerHTML || "";
    }
    this.elements.forEach((el: Element) => (el.innerHTML = htmlContent));
    return this;
  }

  public find(selector: string): NotJQuery {
    if (!this.assertElement(null, "find")) return this;
    const foundElements: Element[] = [];
    this.elements.forEach((el: Element) => {
      const children = el.querySelectorAll(selector);
      foundElements.push(...children);
    });

    const instance = new NotJQuery(null as any); // Create a new instance
    (instance as any).elements = foundElements; // Assign found elements
    return instance;
  }

  public val(value?: string): string | NotJQuery {
    if (!this.assertElement(null, "val")) return this;
    if (value === undefined) {
      return (this.elements[0] as HTMLInputElement)?.value || "";
    }
    this.elements.forEach(
      (el: Element) => ((el as HTMLInputElement).value = value)
    );
    return this;
  }

  public on(event: string, handler: EventListener): NotJQuery {
    // No assert?
    this.elements.forEach((el: Element | Window) =>
      el.addEventListener(event, handler)
    );
    return this;
  }

  public off(event: string, handler: EventListener): NotJQuery {
    for (let i = 0, len = this.elements.length; i < len; i++) {
      const el = this.elements[i];
      if (el instanceof Element || el === window || el === document) { //Manual assertion
        if (event) {
          if (handler) {
            // Remove a specific handler for a specific event
            el.removeEventListener(event, handler);
          } else {
            // Remove all handlers for a specific event
            const clone = el.cloneNode(true) as Element;
            el.parentNode?.replaceChild(clone, el);
          }
        } else {
          console.warn("You must specify an event type when calling .off().");
        }
      }
    }
    return this;
  }

  private _get_width_or_height(toGet: "width" | "height"): number | null {
    const el = this.elements[0];
    if (el === window) {
      return toGet === "width" ? window.innerWidth : window.innerHeight;
    } else if (el instanceof Element) {
      return el.getBoundingClientRect()[toGet as keyof DOMRect] as number;
    }
    console.warn("Cannot determine width for the given selector.");
    return null;
  }

  public width(): number | null {
    return this._get_width_or_height("width");
  }

  public height(): number | null {
    return this._get_width_or_height("height");
  }

  public ready(callback: () => void): void {
    if (this.elements[0] === document) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
      } else {
        // If already ready, execute the callback immediately
        callback();
      }
    } else {
      console.warn("ready() is only available on the document object."); // I'm not sure about that
    }
  }

  //endregion
}

const ProxyNotJQuery = (selector: string | Element | Window) => {
  // Ensure correct usage of the class constructor
  const instance = new NotJQuery(selector);

  return new Proxy(instance, {
    get(target, prop) {
      return Reflect.get(target, prop);
    }
  });
};

// Export as $ to be used as jQuery
// TODO: Verify if we should export jQuery too
(window as any).$ = ProxyNotJQuery;
(window as any).jQuery = (window as any).$;
