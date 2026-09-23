// Tiny path-based navigation helper (clean URLs like /register, /admin).
// Uses the History API and notifies the app via a synthetic popstate event,
// so App.jsx re-renders without a full page reload. In-page hash anchors
// (#contact, #registration…) are untouched and keep working as before.

export function currentPath() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

export function navigate(path) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, "", path);
  }
  // pushState doesn't fire popstate; dispatch one so listeners update.
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "auto" });
}
