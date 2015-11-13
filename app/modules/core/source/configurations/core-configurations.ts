/// <reference path="../../../../_dependencies.ts" />
'use strict'
module core {
	export class CoreConfigurations {
		constructor($routeProvider: any) {
			$routeProvider.when('/', {
				template: '<h1>Titulo</h1>'
			});
		}
	}
}