/*
 * We use [&:not(:disabled)]:hover so it also works with regular <a> tags.
 * If we use "hover:enabled:" instead, it doesn't work with regular <a> tags
 * because they don't have a enabled/disable attribute as <button>s have.
 */

export const buttonCommonClassName =
  "flex items-center justify-center rounded-md text-sm font-medium";

export const buttonGreenClassName = `${buttonCommonClassName} shadow-sm px-3.5 py-2.5 bg-green-600 text-white [&:not(:disabled)]:hover:bg-green-500 disabled:cursor-not-allowed`;

export const buttonRedClassName = `${buttonCommonClassName} shadow-sm px-3.5 py-2.5 border border-red-600 bg-white text-red-600 [&:not(:disabled)]:hover:bg-gray-50 disabled:cursor-not-allowed`;

export const buttonWhiteClassName = `${buttonCommonClassName} shadow-sm px-3.5 py-2.5 border bg-white text-gray-700 [&:not(:disabled)]:hover:bg-gray-50 disabled:cursor-not-allowed`;

export const buttonLinkClassName = `${buttonCommonClassName} text-gray-700 px-0 py-0 hover:enabled:bg-transparent [&:not(:disabled)]:hover:text-green-600 [&:not(:disabled)]:hover:fill-green-600 disabled:cursor-not-allowed`;

export const buttonGhostClassName = `${buttonCommonClassName} shadow-sm px-3.5 py-2.5 bg-white border border-application-nightgreen transition-colors hover:text-white [&:not(:disabled)]:hover:bg-application-green 
text-xs disabled:cursor-not-allowed focus:shadow-outline transition-colors hover:bg-application-green hover:border-application-green hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
focus-visible:outline-application-nightgreen active:bg-application-nightgreen aria-disabled:cursor-not-allowed aria-disabled:opacity-50 text-border-application-green dark:bg-black`;

export const buttonConfirmClassName = `${buttonCommonClassName} shadow-sm px-3.5 py-2.5 border transition-colors hover:text-white [&:not(:disabled)]:hover:bg-application-green 
leading-none bg-application-nightgreen px-4 text-xs font-medium transition-colors hover:bg-application-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
focus-visible:outline-application-nightgreen active:bg-application-nightgreen aria-disabled:cursor-not-allowed aria-disabled:opacity-50 text-white`;

