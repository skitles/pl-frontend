/// <reference path="./_dependencies.ts" />

module application {
	'use strict';
	import dep_core = core;	
	angular.module('application', [])
		.controller('CoreController', ['$scope', dep_core.Core]);
}