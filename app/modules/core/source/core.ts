
module core {
	
	export interface CoreScope extends ng.IScope {
		title: string;
	}
	
	export class Core {
		private scope: CoreScope;
		
		constructor(scope: CoreScope) {
			this.scope = scope;
		}
		
		public setTitle(title: string): void {
			this.scope.title = title;
		}
		
	}
}