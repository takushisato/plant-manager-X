import { TextEncoder, TextDecoder } from "util";

// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

// @ts-ignore
global.window.HTMLElement.prototype.scrollTo = function () {};
