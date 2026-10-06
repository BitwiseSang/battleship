import { toastsContainerElement } from "../main";

interface ToastProps {
  title?: string;
  message: string;
  type: string;
}

function createToast({ title, message, type }: ToastProps): HTMLDivElement {
  const toastContainerElement: HTMLDivElement = document.createElement("div");
  toastContainerElement.classList.add("toast-container");

  const toastActionContainer: HTMLDivElement = document.createElement("div");
  toastActionContainer.classList.add("toast__dismiss-btn-container");

  const toastDismissButton: HTMLButtonElement =
    document.createElement("button");
  toastDismissButton.classList.add("toast__dismiss-btn");

  toastDismissButton.innerHTML = `
<svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracurrentColorerCarrier" stroke-linecurrentcolorap="round" stroke-linejoin="round"></g><g id="SVGRepo_icurrentColoronCarrier"> <path d="M3 21.32L21 3.32001" stroke="currentColor" stroke-width="1.5" stroke-linecurrentcolorap="round" stroke-linejoin="round"></path> <path d="M3 3.32001L21 21.32" stroke="currentColor" stroke-width="1.5" stroke-linecurrentcolorap="round" stroke-linejoin="round"></path> </g></svg>
`;

  toastActionContainer.append(toastDismissButton);

  const toastDiv: HTMLDivElement = document.createElement("div");
  toastDiv.classList.add("toast");

  const toastTextContainer: HTMLDivElement = document.createElement("div");
  toastTextContainer.classList.add("toast__text-container");

  const toastMessageElement: HTMLParagraphElement = document.createElement("p");
  toastMessageElement.classList.add("toast__message");
  toastMessageElement.textContent = message;

  const toastIconContainer: HTMLDivElement = document.createElement("div");
  toastIconContainer.classList.add("toast-icon-container");

  if (title) {
    const toastTitleElement: HTMLHeadingElement = document.createElement("h2");
    toastTitleElement.textContent = title;
    toastTitleElement.classList.add("toast__title");

    toastTextContainer.append(toastTitleElement, toastMessageElement);
  } else {
    toastTextContainer.appendChild(toastMessageElement);
  }

  switch (type) {
    case "success":
      toastIconContainer.innerHTML = `
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracurrentColorerCarrier" stroke-linecurrentcap="round" stroke-linejoin="round"></g><g id="SVGRepo_icurrentColoronCarrier"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"></path></g></svg>
`;
      toastContainerElement.classList.add("success");
      break;
    case "warning":
      toastIconContainer.innerHTML = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracurrentColorerCarrier" stroke-linecurrentcap="round" stroke-linejoin="round"></g><g id="SVGRepo_icurrentColoronCarrier"> <path fill-rule="evenodd" currentclip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="currentColor"></path> </g></svg>
`;
      toastContainerElement.classList.add("warning");
      break;
    case "danger":
      toastIconContainer.innerHTML = `
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracurrentColorerCarrier" stroke-linecurrentcap="round" stroke-linejoin="round"></g><g id="SVGRepo_icurrentColoronCarrier"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256zm0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4z"></path></g></svg>
`;
      toastContainerElement.classList.add("danger");
      break;
  }

  toastDiv.append(toastIconContainer, toastTextContainer);

  toastContainerElement.append(toastDiv, toastActionContainer);

  toastContainerElement.addEventListener("animationend", () =>
    toastContainerElement.remove(),
  );

  toastDismissButton.addEventListener("click", () =>
    toastContainerElement.remove(),
  );

  return toastContainerElement;
}

export function success(message: string) {
  toastsContainerElement.append(createToast({ message, type: "success" }));
}

export function info(message: string) {
  toastsContainerElement.append(createToast({ message, type: "warning" }));
}

export function failure(title: string, message: string) {
  toastsContainerElement.append(
    createToast({ title, message, type: "danger" }),
  );
}
