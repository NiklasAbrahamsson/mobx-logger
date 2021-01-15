'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _utils = require('./utils');

var style = function style(color) {
  var bold =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  return (
    'color:' +
    color +
    ';font-weight:' +
    (bold ? '600' : '300') +
    ';font-size:11px'
  );
};

var defaultLoggerConfig = {
  disable: false,
  functions: {},
};

var getLoggerConfig = function getLoggerConfig(ev) {
  if (ev.object == null) {
    return defaultLoggerConfig;
  }
  var loggerConfig = ev.object.constructor.mobxLoggerConfig;
  return loggerConfig == null ? defaultLoggerConfig : loggerConfig;
};

var isLoggingEnabled = function isLoggingEnabled(ev) {
  if (ev.object == null) {
    return false;
  }
  var loggerConfig = getLoggerConfig(ev);
  if (loggerConfig == null) {
    return true;
  }
  var enabled = loggerConfig.enabled === true || loggerConfig.enabled == null;
  if (loggerConfig.methods == null) {
    return enabled;
  }
  var propertyName = getPropName(ev);
  var methodLoggerConfig = loggerConfig.methods[propertyName];
  if (methodLoggerConfig == null) {
    return enabled;
  }
  if (methodLoggerConfig === true) {
    return true;
  }
  if (methodLoggerConfig === false) {
    return false;
  }
  return methodLoggerConfig.enabled !== false;
};

var logAction = function logAction(ev) {
  if (!isLoggingEnabled(ev)) {
    return;
  }

  console.groupCollapsed(
    '%c%s  %s  %s.%s()',
    style('#fe424d'),
    (0, _utils.now)(),
    (0, _utils.padStart)('ACTION', 8),
    ev.object.name || ev.object,
    ev.name
  );
  console.log('%cFunction %o', style('#fe424d'), ev.fn);
  console.log('%cArguments %o', style('#fe424d'), ev.arguments);
  console.log('%cTarget %o', style('#fe424d'), ev.object);
  console.log('%cEvent %o', style('#fe424d'), ev);
  console.groupEnd();
};

var logReaction = function logReaction(ev) {
  var name = ev.name.replace('#null', '');
  console.groupCollapsed(
    '%c%s  %s  %s',
    style('#fe424d'),
    (0, _utils.now)(),
    (0, _utils.padStart)('REACTION', 8),
    name
  );

  var observables = ev.observing || [];
  var names = observables.map(function (it) {
    return it.name;
  });
  if (names.length > 0) {
    console.log('%cObserving %o', style('#fe424d'), names);
  }

  console.log('%cEvent %o', style('#fe424d'), ev);
  console.groupEnd();
};

var logTransaction = function logTransaction(ev) {
  console.groupCollapsed(
    '%c%s  %s  %s',
    style('#7B7B7B'),
    (0, _utils.now)(),
    (0, _utils.padStart)('TX', 8),
    ev.name
  );
  console.log('%cEvent %o', style('#fe424d'), ev);
  console.groupEnd();
};

var logCompute = function logCompute(ev) {
  if (!isLoggingEnabled(ev)) {
    return;
  }
  var name = ev.object;
  var propName = getPropName(ev);
  if (propName) {
    propName = '.' + propName;
  }
  console.groupCollapsed(
    '%c%s  %s  %s%s',
    style('#9E9E9E'),
    (0, _utils.now)(),
    (0, _utils.padStart)('COMPUTE', 8),
    name,
    propName
  );
  console.log('%cEvent %o', style('#fe424d'), ev);
  console.groupEnd();
};

var getPropName = function getPropName(ev) {
  if (ev.name != null) {
    return ev.name;
  }
  return (
    Object.keys(ev.object.$mobx.values).filter(function (key) {
      return ev.object.$mobx.values[key].derivation === ev.fn;
    })[0] || ''
  );
};

exports.default = function (ev, options) {
  if (options[ev.type] !== true) {
    return;
  }

  switch (ev.type) {
    case 'action':
      logAction(ev);
      return;
    case 'reaction':
      logReaction(ev);
      return;
    case 'transaction':
      logTransaction(ev);
      return;
    case 'compute':
      logCompute(ev);
      return;
  }
};
