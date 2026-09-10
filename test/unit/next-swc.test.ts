/* eslint-env jest */
import { transform } from 'next/dist/build/swc'
import { installBindings } from 'next/dist/build/swc/install-bindings'
import { execFile } from 'child_process'
import path from 'path'
import fsp from 'fs/promises'

const swc = async (code) => {
  let output = await transform(code)
  return output.code
}

const trim = (s) => s.join('\n').trim().replace(/^\s+/gm, '')

describe('next/swc', () => {
  beforeAll(async () => {
    await installBindings()
  })
  describe('hook_optimizer', () => {
    it('should leave alone array destructuring of hooks', async () => {
      const output = await swc(
        trim`
        import { useState } from 'react';
        const [count, setCount] = useState(0);
      `
      )

      expect(output).toMatchInlineSnapshot(`
       "function _array_like_to_array(arr, len) {
           if (len == null || len > arr.length) len = arr.length;
           for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
           return arr2;
       }
       function _array_with_holes(arr) {
           if (Array.isArray(arr)) return arr;
       }
       function _iterable_to_array_limit(arr, i) {
           var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
           if (_i == null) return;
           var _arr = [];
           var _n = true;
           var _d = false;
           var _s, _e;
           try {
               for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
                   _arr.push(_s.value);
                   if (i && _arr.length === i) break;
               }
           } catch (err) {
               _d = true;
               _e = err;
           } finally{
               try {
                   if (!_n && _i["return"] != null) _i["return"]();
               } finally{
                   if (_d) throw _e;
               }
           }
           return _arr;
       }
       function _non_iterable_rest() {
           throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
       }
       function _sliced_to_array(arr, i) {
           return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
       }
       function _unsupported_iterable_to_array(o, minLen) {
           if (!o) return;
           if (typeof o === "string") return _array_like_to_array(o, minLen);
           var n = Object.prototype.toString.call(o).slice(8, -1);
           if (n === "Object" && o.constructor) n = o.constructor.name;
           if (n === "Map" || n === "Set") return Array.from(n);
           if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
       }
       import { useState } from 'react';
       var _useState = _sliced_to_array(useState(0), 2), count = _useState[0], setCount = _useState[1];
       "
      `)
    })

    it('should leave alone array spread of hooks', async () => {
      const output = await swc(
        trim`
        import { useState } from 'react';
        const [...copy] = useState(0);
      `
      )

      expect(output).toMatchInlineSnapshot(`
       "function _array_like_to_array(arr, len) {
           if (len == null || len > arr.length) len = arr.length;
           for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
           return arr2;
       }
       function _array_with_holes(arr) {
           if (Array.isArray(arr)) return arr;
       }
       function _iterable_to_array(iter) {
           if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) {
               return Array.from(iter);
           }
       }
       function _non_iterable_rest() {
           throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
       }
       function _to_array(arr) {
           return _array_with_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_rest();
       }
       function _unsupported_iterable_to_array(o, minLen) {
           if (!o) return;
           if (typeof o === "string") return _array_like_to_array(o, minLen);
           var n = Object.prototype.toString.call(o).slice(8, -1);
           if (n === "Object" && o.constructor) n = o.constructor.name;
           if (n === "Map" || n === "Set") return Array.from(n);
           if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
       }
       import { useState } from 'react';
       var _useState = _to_array(useState(0)), copy = _useState.slice(0);
       "
      `)
    })
  })

  describe('styled_jsx', () => {
    // The styled-jsx transform used to loop forever when a local variable
    // derived from a non-static expression was used as a JSX element name and
    // the same component also contained a dynamic interpolation inside
    // `<style jsx>`, so `next build`/`next dev` never finished.
    // x-ref: https://github.com/vercel/next.js/issues/97685
    //
    // The loop happens on a native thread, so the transform runs in a child
    // process that can be killed instead of hanging the whole test run.
    const transformInChildProcess = (code: string, timeout: number) =>
      new Promise<{ timedOut: boolean; stdout: string; stderr: string }>(
        (resolve) => {
          const script = `
            const swc = require(process.env.__NEXT_SWC_TEST_MODULE)
            swc
              .loadBindings()
              .then(() =>
                swc.transform(process.env.__NEXT_SWC_TEST_INPUT, {
                  filename: 'pages/index.tsx',
                  jsc: { parser: { syntax: 'typescript', tsx: true } },
                  styledJsx: true,
                })
              )
              .then(
                (output) => process.stdout.write(output.code),
                (error) => {
                  console.error(error)
                  process.exit(1)
                }
              )
          `

          execFile(
            process.execPath,
            ['-e', script],
            {
              timeout,
              env: {
                ...process.env,
                __NEXT_SWC_TEST_MODULE: require.resolve('next/dist/build/swc'),
                __NEXT_SWC_TEST_INPUT: code,
              },
            },
            (error, stdout, stderr) => {
              const timedOut = Boolean(error && (error as any).killed)

              resolve({
                timedOut,
                stdout,
                stderr: error && !timedOut ? stderr || String(error) : stderr,
              })
            }
          )
        }
      )

    it(
      'should not hang on a dynamic interpolation next to a locally derived component',
      async () => {
        const { timedOut, stdout, stderr } = await transformInChildProcess(
          trim`
        const Probe = (props: { theme: { color: string; icon: any } }) => {
        const t = props.theme;
        const Icon = t.icon;
        return (
        <div className="probe">
        <Icon />
        <style jsx>{\`
        .probe {
        color: \${t.color};
        }
        \`}</style>
        </div>
        );
        };

        export default function Home() {
        return <Probe theme={{ color: '#f00', icon: 'div' }} />;
        }
      `,
          30 * 1000
        )

        expect({ timedOut, stderr }).toEqual({ timedOut: false, stderr: '' })
        expect(stdout).toContain('styled-jsx/style')
        expect(stdout).toContain('_JSXStyle.dynamic')
      },
      60 * 1000
    )
  })

  describe('private env replacement', () => {
    it('__NEXT_REQUIRED_NODE_VERSION_RANGE is replaced', async () => {
      const pkgDir = path.dirname(require.resolve('next/package.json'))
      const nextEntryContent = await fsp.readFile(
        path.join(pkgDir, 'dist/bin/next'),
        'utf8'
      )
      expect(nextEntryContent).not.toContain(
        '__NEXT_REQUIRED_NODE_VERSION_RANGE'
      )
      expect(nextEntryContent).toMatch(
        /For Next.js, Node.js version "\$\{">=\d+\.\d+\.\d*"\}" is required./
      )
    })
  })
})
