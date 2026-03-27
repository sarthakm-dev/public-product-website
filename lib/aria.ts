export function composeAriaDescribedBy(
  ...ids: Array<string | false | null | undefined>
) {
  const value = ids.filter(Boolean).join(' ');
  return value || undefined;
}

export function scrollAndFocusElement(
  element: HTMLElement | null | undefined,
  options?: ScrollIntoViewOptions
) {
  if (!element) {
    return;
  }

  if ('focus' in element && typeof element.focus === 'function') {
    element.focus({ preventScroll: true });
  }

  requestAnimationFrame(() => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
      ...options,
    });
  });
}
