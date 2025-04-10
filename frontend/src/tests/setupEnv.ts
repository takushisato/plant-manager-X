import "dotenv/config";
import { TextEncoder, TextDecoder } from "util";

Object.assign(global, {
  TextEncoder,
  TextDecoder,
});