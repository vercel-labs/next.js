# Repro: server actions cannot be aborted with AbortController (#81418)

    npm install
    npm run dev   # watch this terminal
    # open http://localhost:3000, click "start action (10s)", then click "abort()"

Observed (Next 15.5.4, `next dev`):

* server log prints `addTodo START` then `addTodo FINISHED` a full 10s later, even
  though `controller.abort()` fired ~1.5s in;
* the client promise still resolves with the action result after the abort;
* same result when the tab is closed mid-flight (real TCP disconnect): the action
  runs to completion server-side.

There is no supported way to pass an `AbortSignal` into a server action call, and
the action body has no request signal to observe.
