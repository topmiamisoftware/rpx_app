"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotbieMetaService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let SpotbieMetaService = class SpotbieMetaService {
    constructor(titleService, metaService) {
        this.titleService = titleService;
        this.metaService = metaService;
    }
    setTitle(title) {
        this.titleService.setTitle(title);
        this.metaService.updateTag({ name: 'twitter:title', content: title });
        this.metaService.updateTag({ name: 'og:title', content: title });
    }
    setDescription(description) {
        this.metaService.updateTag({ name: 'description', content: description });
        this.metaService.updateTag({ name: 'og:description', content: description });
        this.metaService.updateTag({
            name: 'twitter:description',
            content: description,
        });
        this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
    }
    setImage(imageUrl) {
        this.metaService.updateTag({ name: 'image', content: imageUrl });
        this.metaService.updateTag({ name: 'og:image', content: imageUrl });
        this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
    }
};
SpotbieMetaService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], SpotbieMetaService);
exports.SpotbieMetaService = SpotbieMetaService;
//# sourceMappingURL=spotbie-meta.service.js.map