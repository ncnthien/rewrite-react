const React = (function () {
  let hooks = [];
  let idx = 0;

  function useState(initialValue) {
    const _idx = idx;

    const state = hooks[_idx] || initialValue;
    function setState(newVal) {
      hooks[_idx] = newVal;
    }

    idx++;
    return [state, setState];
  }

  function useEffect(cb, depArray) {
    const oldDeps = hooks[idx];
    let hasChanged = true;

    if (oldDeps) {
      hasChanged = depArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
    }

    if (hasChanged) cb();

    hooks[idx] = depArray;
    idx++;
  }

  function useCallback(cb, depArray) {
    const hasChanged = depArray.some(
      (dep, i) => !Object.is(dep, hooks[idx]?.deps?.[i])
    );

    if (!hooks[idx] || hasChanged) {
      hooks[idx] = {
        deps: depArray,
        value: cb,
      };
      idx++;
      return cb;
    } else {
      const oldValue = hooks[idx].value;
      idx++;
      return oldValue;
    }
  }

  function useMemo(cb, depArray) {
    return useCallback(cb(), depArray);
  }

  function render(Component) {
    idx = 0;
    const c = Component();
    c.render();
    return c;
  }

  return { render, useState, useEffect, useMemo, useCallback };
})();

function Component() {
  const [count, setCount] = React.useState(1);
  const [text, setText] = React.useState("foo");
  const computedCount = React.useMemo(() => {
    return count + 12;
  }, []);

  React.useEffect(() => {
    console.log("from useEffect!");
  }, []);

  return {
    render: () => console.log({ count, text, computedCount }),
    click: () => setCount(count + 1),
    type: (word) => setText(word),
  };
}

var App = React.render(Component);

App.click();
var App = React.render(Component);

App.type("bar");
var App = React.render(Component);
