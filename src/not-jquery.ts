type Selector = NodeListOf<Element> | Element | Window | Document | HTMLDivElement | string;
type JElement = Omit<Selector, string> | null;

class NotJQuery {

  elements: JElement;

  constructor(selector: Selector) {
    this.elements = [];
    if (selector === window || selector === document) {
      // Handle the window object explicitly
      this.elements = [selector];
    } else if (typeof selector === "string") {
      this.elements = document.querySelectorAll(selector);
    } else {
      console.error(`Element ${selector} not compatible!`);
    }
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
          `Cannot do ${action || "that"}, ${typeof element} (${element}) is not supported!`
        );
        return false;
      }
    }
    return true;
  }

  //region Emulations
  public addClass(className: string): NotJQuery {
    if (!this.elements) return this;
    let theseEl = this.elements as NodeListOf<Element>;
    for (let i = 0, len = theseEl.length; i < len; i++) {
      let el = theseEl[i];
      if (!this.assertElement(theseEl[i], "addClass")) continue;
      el.classList.add(className);
    }
    return this;
  }

  public removeClass(className: string): NotJQuery {
    if (!this.assertElement(null, "removeClass")) return this;
    let theseEl = this.elements as NodeListOf<Element>;
    theseEl.forEach((el: Element) => el.classList.remove(className));
    return this;
  }

  // public html(htmlContent?: string): string | NotJQuery { //Not needed?
  //   if (!this.assertElement(null, "html")) return this;
  //   if (htmlContent === undefined) {
  //     return this.elements[0]?.innerHTML || "";
  //   }
  //   this.elements.forEach((el: Element) => (el.innerHTML = htmlContent));
  //   return this;
  // }

  public find(selector: string): NotJQuery {
    if (!this.assertElement(null, "find")) return this;
    let theseEl = this.elements as NodeListOf<Element>;
    let foundElements: Element[] = [];

    theseEl.forEach((el: Element) => {
      const children = el.querySelectorAll(selector);
      foundElements.push(...Array.from(children));
    });

    const instance = new NotJQuery(null as any); // Create a new instance
    (instance as any).elements = foundElements; // Assign found elements
    return instance;
  }

  public val(value?: string): string | NotJQuery {
    if (!this.assertElement(null, "val")) return this;
    if (value === undefined) {
      const el = this.elements[0 as keyof typeof this.elements] as HTMLInputElement;
      return (this.elements[0 as keyof typeof this.elements] as HTMLInputElement)?.value || "";
    }
    (this.elements as Element[]).forEach(
      (el: Element) => ((el as HTMLInputElement).value = value)
    );
    return this;
  }

  public on(event: string, handler: EventListener): NotJQuery {
    // No assert?
    (this.elements as Element[]).forEach((el: Element | Window) =>
      el.addEventListener(event, handler)
    );
    return this;
  }

  public off(event: string, handler: EventListener): NotJQuery {
    for (let i = 0, len = (this.elements as Element[]).length; i < len; i++) {
      const el = this.elements[i as keyof typeof this.elements] as any;
      if (el instanceof Element || el === window || el === document) {
        //Manual assertion
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
    const el = this.elements[0 as keyof typeof this.elements] as JElement;
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
    if (this.elements[0 as keyof typeof this.elements] === document) {
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
