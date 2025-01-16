class NotJQuery {
  elements: NodeListOf<Element>;

  constructor(selector: string) {
    this.elements = document.querySelectorAll(selector);
  }

  // Implementation of supported functions

  addClass(className: string): NotJQuery {
    this.elements.forEach((el) => el.classList.add(className));
    return this;
  }

  removeClass(className: string): NotJQuery {
    this.elements.forEach((el) => el.classList.remove(className));
    return this;
  }

  html(htmlContent?: string): string | NotJQuery {
    if (htmlContent === undefined) {
      return this.elements[0]?.innerHTML || "";
    }
    this.elements.forEach((el) => (el.innerHTML = htmlContent));
    return this;
  }

  val(value?: string): string | NotJQuery {
    if (value === undefined) {
      return (this.elements[0] as HTMLInputElement)?.value || "";
    }
    this.elements.forEach((el) => ((el as HTMLInputElement).value = value));
    return this;
  }

  on(event: string, handler: EventListener): NotJQuery {
    this.elements.forEach((el) => el.addEventListener(event, handler));
    return this;
  }
}

// List of implemented functions
const supportedFunctions = ["addClass", "removeClass", "html", "val", "on"];

// Proxy to check function calls
//TODO: Verify if it's REALLY necessary
const ProxyJQuery = (selector: string) => {
  const instance = new NotJQuery(selector);

  return new Proxy(instance, {
    get(target, prop) {
      if (typeof prop === "string" && !supportedFunctions.includes(prop)) {
        console.warn(
          `The function "${prop}" is not implemented in not-jquery.`,
        );
        return undefined; // Evita errori runtime
      }
      return Reflect.get(target, prop);
    },
  });
};

// Export as $ to be used as jQuery
// TODO: Verify if we should export jQuery too

(window as any).$ = ProxyJQuery;
