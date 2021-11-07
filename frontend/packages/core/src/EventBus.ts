export function EventBus<T>(name: string) {
  function listen(callback: (event: CustomEvent) => any) {
    document.addEventListener(name, callback)
  }

  function dispatch(data: T) {
    document.dispatchEvent(new CustomEvent<T>(name, { detail: data }))
  }

  function destroy(callback: (event: CustomEvent) => any) {
    document.removeEventListener(name, callback)
  }

  return { listen, dispatch, destroy }
}
