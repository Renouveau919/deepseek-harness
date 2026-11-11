/**
 * Host half of the SDD stage launcher.
 *
 * The launcher is a Client-only surface: it reads no Host state and exposes no
 * service, tool, or route. The Host row exists so the bundle has one activation
 * record and the Loader can report the row in the plugin inventory.
 */
export function apply() {}
