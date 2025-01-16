class NotJQuery {
  elements: NodeListOf<Element> | Array<Window> | Array<Document> | any;

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

  public assertElement(element?: any, action?: string): boolean {
    let length = 0;

    if (!element) element = this.elements;

    if (Array.isArray(element)) {
      length = element.length;
    } else length = 1;

    for (let i = 0, len = length; i < len; i++) {
      if (!(element instanceof Element)) {
        console.warn(
          `Cannot ${action || "do that"}, ${typeof element} (${element}) is not supported!`,
        );
        return false;
      }
    }
    return true;
  }

  //region Emulations
  public addClass(className: string): NotJQuery {
    if (!this.assertElement()) return this;
    this.elements.forEach((el: Element) => {
      if (this.assertElement(el)) {
        el.classList.add(className);
      } else
        console.warn(
          `Cannot add class '${className}', ${typeof el} (${el}) is not supported`,
        );
    });
    return this;
  }

  public removeClass(className: string): NotJQuery {
    if (!this.assertElement()) return this;
    this.elements.forEach((el: Element) => el.classList.remove(className));
    return this;
  }

  public html(htmlContent?: string): string | NotJQuery {
    if (!this.assertElement()) return this;
    if (htmlContent === undefined) {
      return this.elements[0]?.innerHTML || "";
    }
    this.elements.forEach((el: Element) => (el.innerHTML = htmlContent));
    return this;
  }

  public val(value?: string): string | NotJQuery {
    if (!this.assertElement()) return this;
    if (value === undefined) {
      return (this.elements[0] as HTMLInputElement)?.value || "";
    }
    this.elements.forEach(
      (el: Element) => ((el as HTMLInputElement).value = value),
    );
    return this;
  }

  public on(event: string, handler: EventListener): NotJQuery {
    console.log(this.elements);
    this.elements.forEach((el: Element | Window) =>
      el.addEventListener(event, handler),
    );
    return this;
  }

  private get_width_or_height(toGet: "width" | "height"): number | null {
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
    return this.get_width_or_height("width");
  }

  public height(): number | null {
    return this.get_width_or_height("height");
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
      console.warn("ready() is only available on the document object.");
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
    },
  });
};

// Export as $ to be used as jQuery
// TODO: Verify if we should export jQuery too
(window as any).$ = ProxyNotJQuery;
(window as any).jQuery = ProxyNotJQuery;
