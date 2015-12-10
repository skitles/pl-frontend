/// <reference path="../../../_dependencies.ts" />
module core {
	import dep_CoreConfig = core;
	angular.module('application-core', [])
	.config(['$routeProvider', dep_CoreConfig.CoreConfigurations]);
}