"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardCreatorComponent = void 0;
const tslib_1 = require("tslib");
const http_1 = require("@angular/common/http");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const reward_1 = require("../../../../models/reward");
const environment_1 = require("../../../../../environments/environment");
const spotbieGlobals = require("../../../../globals");
const preferences_1 = require("@capacitor/preferences");
const REWARD_MEDIA_UPLOAD_API_URL = `${spotbieGlobals.API}reward/upload-media`;
const REWARD_MEDIA_MAX_UPLOAD_SIZE = 25e6;
const QR_CODE_CALIM_REWARD_SCAN_BASE_URL = environment_1.environment.qrCodeRewardScanBaseUrl;
let RewardCreatorComponent = class RewardCreatorComponent {
    constructor(formBuilder, rewardCreatorService, http) {
        this.formBuilder = formBuilder;
        this.rewardCreatorService = rewardCreatorService;
        this.http = http;
        this.closeParentWindowEvt = new core_1.EventEmitter();
        this.closeRewardCreatorEvt = new core_1.EventEmitter();
        this.closeRewardCreatorAndRefetchRewardListEvt = new core_1.EventEmitter();
        this.loading = false;
        this.rewardCreatorFormUp = false;
        this.rewardClaimUrl = null;
        this.rewardFormSubmitted = false;
        this.rewardUploadImage = '../../assets/images/home_imgs/find-places-to-eat.svg';
        this.rewardMediaMessage = 'Upload Reward Image';
        this.rewardMediaUploadProgress = 0;
        this.businessPointsDollarValue = '0';
        this.dollarValueCalculated = false;
        this.rewardTypeList = ['Something From Our Menu', 'Discount'];
        this.rewardCreated = false;
        this.rewardDeleted = false;
        this.uploadMediaForm = false;
        this.qrCodeClaimReward = QR_CODE_CALIM_REWARD_SCAN_BASE_URL;
    }
    get rewardType() {
        return this.rewardCreatorForm.get('rewardType').value;
    }
    get rewardValue() {
        return this.rewardCreatorForm.get('rewardValue').value;
    }
    get rewardName() {
        return this.rewardCreatorForm.get('rewardName').value;
    }
    get rewardDescription() {
        return this.rewardCreatorForm.get('rewardDescription').value;
    }
    get rewardImage() {
        return this.rewardCreatorForm.get('rewardImage').value;
    }
    get f() {
        return this.rewardCreatorForm.controls;
    }
    initRewardForm() {
        const rewardTypeValidators = [forms_1.Validators.required];
        const rewardValueValidators = [forms_1.Validators.required];
        const rewardNameValidators = [
            forms_1.Validators.required,
            forms_1.Validators.maxLength(50),
        ];
        const rewardDescriptionValidators = [
            forms_1.Validators.required,
            forms_1.Validators.maxLength(250),
            forms_1.Validators.minLength(50),
        ];
        const rewardImageValidators = [forms_1.Validators.required];
        this.rewardCreatorForm = this.formBuilder.group({
            rewardType: ['', rewardTypeValidators],
            rewardValue: ['', rewardValueValidators],
            rewardName: ['', rewardNameValidators],
            rewardDescription: ['', rewardDescriptionValidators],
            rewardImage: ['', rewardImageValidators],
        });
        if (this.reward) {
            this.rewardCreatorForm.get('rewardType').setValue(this.reward.type);
            this.rewardCreatorForm.get('rewardValue').setValue(this.reward.point_cost);
            this.rewardCreatorForm.get('rewardName').setValue(this.reward.name);
            this.rewardCreatorForm.get('rewardDescription').setValue(this.reward.description);
            this.rewardCreatorForm.get('rewardImage').setValue(this.reward.images);
            this.rewardUploadImage = this.reward.images;
            this.setRewardLink();
            this.calculateDollarValue();
        }
        this.rewardCreatorFormUp = true;
        this.loading = false;
    }
    setReward(reward) {
        this.reward = reward;
        this.setRewardLink();
    }
    setRewardLink() {
        this.rewardClaimUrl = `${this.qrCodeClaimReward}?&r=${this.reward.uuid}&t=claim_reward`;
    }
    calculateDollarValue() {
        const pointPercentage = this.loyaltyPointBalance.loyalty_point_dollar_percent_value;
        const itemPrice = this.rewardValue;
        if (pointPercentage === 0 || pointPercentage === null) {
            this.businessPointsDollarValue = '0';
        }
        else {
            this.businessPointsDollarValue = (itemPrice *
                (pointPercentage / 100)).toFixed(2);
        }
        this.dollarValueCalculated = true;
    }
    saveReward() {
        this.rewardFormSubmitted = true;
        this.spbTopAnchor.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
        const itemObj = new reward_1.Reward();
        itemObj.name = this.rewardName;
        itemObj.description = this.rewardDescription;
        itemObj.images = this.rewardImage;
        itemObj.point_cost = this.rewardValue;
        itemObj.type = this.rewardType;
        if (!this.reward) {
            this.rewardCreatorService.saveItem(itemObj).subscribe(resp => {
                this.saveRewardCb(resp);
            });
        }
        else {
            itemObj.id = this.reward.id;
            this.rewardCreatorService.updateItem(itemObj).subscribe(resp => {
                this.saveRewardCb(resp);
            });
        }
    }
    saveRewardCb(resp) {
        console.log(resp);
        if (resp.success) {
            this.rewardCreated = true;
            setTimeout(() => {
                this.closeRewardCreatorAndRefetchRewardList();
            }, 1500);
        }
    }
    startRewardMediaUploader() {
        this.rewardMediaInput.nativeElement.click();
    }
    async uploadMedia(files) {
        const fileListLength = files.length;
        if (fileListLength === 0) {
            this.rewardMediaMessage = 'You must upload at least one file.';
            return;
        }
        else if (fileListLength > 1) {
            this.rewardMediaMessage = 'Upload only one item image.';
            return;
        }
        this.loading = true;
        const formData = new FormData();
        let file_to_upload;
        let upload_size = 0;
        for (let i = 0; i < fileListLength; i++) {
            file_to_upload = files[i];
            upload_size += file_to_upload.size;
            if (upload_size > REWARD_MEDIA_MAX_UPLOAD_SIZE) {
                this.rewardMediaMessage = 'Max upload size is 25MB.';
                this.loading = false;
                return;
            }
            formData.append('image', file_to_upload, file_to_upload.name);
        }
        const tokenRet = await preferences_1.Preferences.get({ key: 'spotbiecom_session' });
        const token = tokenRet.value;
        this.http
            .post(REWARD_MEDIA_UPLOAD_API_URL, formData, {
            reportProgress: true,
            observe: 'events',
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .subscribe(event => {
            if (event.type === http_1.HttpEventType.UploadProgress) {
                this.rewardMediaUploadProgress = Math.round((100 * event.loaded) / event.total);
            }
            else if (event.type === http_1.HttpEventType.Response) {
                this.rewardMediaUploadFinished(event.body);
            }
        });
        return;
    }
    rewardMediaUploadFinished(httpResponse) {
        if (httpResponse.success) {
            this.rewardUploadImage = httpResponse.image;
            this.rewardCreatorForm
                .get('rewardImage')
                .setValue(this.rewardUploadImage);
        }
        else {
            console.log('rewardMediaUploadFinished', httpResponse);
        }
        this.loading = false;
    }
    rewardTypeChange() {
        if (this.rewardType === 0) {
            //reward is discount
            this.uploadMediaForm = true;
            this.rewardUploadImage = this.reward.images;
        }
        else {
            //reward is somethign from our menu
            this.uploadMediaForm = false;
        }
    }
    closeRewardCreator() {
        this.closeRewardCreatorEvt.emit();
    }
    closeWindow() {
        this.closeParentWindowEvt.emit();
    }
    closeRewardCreatorAndRefetchRewardList() {
        this.closeRewardCreatorAndRefetchRewardListEvt.emit();
    }
    deleteMe() {
        this.rewardCreatorService.deleteMe(this.reward).subscribe(resp => {
            this.deleteMeCb(resp);
        });
    }
    deleteMeCb(resp) {
        if (resp.success) {
            this.rewardDeleted = true;
            setTimeout(() => {
                this.closeRewardCreatorAndRefetchRewardList();
            }, 1500);
        }
    }
    ngOnInit() {
        this.initRewardForm();
    }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], RewardCreatorComponent.prototype, "reward", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spbInputInfo')
], RewardCreatorComponent.prototype, "spbInputInfo", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('rewardMediaInput')
], RewardCreatorComponent.prototype, "rewardMediaInput", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spbTopAnchor')
], RewardCreatorComponent.prototype, "spbTopAnchor", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], RewardCreatorComponent.prototype, "closeParentWindowEvt", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], RewardCreatorComponent.prototype, "closeRewardCreatorEvt", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], RewardCreatorComponent.prototype, "closeRewardCreatorAndRefetchRewardListEvt", void 0);
RewardCreatorComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-reward-creator',
        templateUrl: './reward-creator.component.html',
        styleUrls: ['./reward-creator.component.css'],
    })
], RewardCreatorComponent);
exports.RewardCreatorComponent = RewardCreatorComponent;
//# sourceMappingURL=reward-creator.component.js.map