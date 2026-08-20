// No "use client": this module is imported by a Server Component.
// Mimics a third-party package (next-redux-wrapper, @emotion/styled, ...)
// that calls React.createContext at module scope.
import { Ctx } from 'vendor-ctx';

export const context = Ctx;
