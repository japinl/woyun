/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-account-box': '&#xe600;',
		'icon-account-circle': '&#xe601;',
		'icon-add': '&#xe655;',
		'icon-add-box': '&#xe656;',
		'icon-add-circle': '&#xe657;',
		'icon-add-circle-outline': '&#xe658;',
		'icon-check-box': '&#xe6b7;',
		'icon-check-box-outline-blank': '&#xe6b8;',
		'icon-check': '&#xe69d;',
		'icon-beenhere': '&#xe699;',
		'icon-clear': '&#xe65b;',
		'icon-highlight-remove': '&#xe619;',
		'icon-remove': '&#xe667;',
		'icon-remove-circle-outline': '&#xe669;',
		'icon-remove-circle': '&#xe668;',
		'icon-redo': '&#xe666;',
		'icon-undo': '&#xe66d;',
		'icon-keyboard-arrow-down': '&#xe689;',
		'icon-keyboard-arrow-left': '&#xe68a;',
		'icon-keyboard-arrow-right': '&#xe68b;',
		'icon-keyboard-arrow-up': '&#xe68c;',
		'icon-pause': '&#xe644;',
		'icon-pause-circle-fill': '&#xe645;',
		'icon-pause-circle-outline': '&#xe646;',
		'icon-messenger': '&#xe650;',
		'icon-history': '&#xe61a;',
		'icon-notifications': '&#xe6ad;',
		'icon-notifications-none': '&#xe6ae;',
		'icon-notifications-off': '&#xe6af;',
		'icon-backspace': '&#xe65a;',
		'icon-cloud': '&#xe67b;',
		'icon-cloud-circle': '&#xe67c;',
		'icon-cloud-done': '&#xe67d;',
		'icon-cloud-download': '&#xe67e;',
		'icon-backup': '&#xe60c;',
		'icon-cloud-off': '&#xe67f;',
		'icon-cloud-queue': '&#xe680;',
		'icon-content-cut': '&#xe65d;',
		'icon-devices': '&#xe66e;',
		'icon-insert-drive-file': '&#xe676;',
		'icon-note-add': '&#xe621;',
		'icon-my-library-books': '&#xe641;',
		'icon-description': '&#xe60e;',
		'icon-flag': '&#xe661;',
		'icon-format-paint': '&#xe673;',
		'icon-info': '&#xe61c;',
		'icon-help': '&#xe618;',
		'icon-vpn-key': '&#xe654;',
		'icon-lock-outline': '&#xe620;',
		'icon-lock-open': '&#xe61f;',
		'icon-email': '&#xe64d;',
		'icon-drafts': '&#xe660;',
		'icon-more-horiz': '&#xe69f;',
		'icon-more-vert': '&#xe6a0;',
		'icon-not-interested': '&#xe643;',
		'icon-create': '&#xe65f;',
		'icon-radio-button-off': '&#xe6b9;',
		'icon-radio-button-on': '&#xe6ba;',
		'icon-receipt': '&#xe62c;',
		'icon-cached': '&#xe60d;',
		'icon-replay': '&#xe647;',
		'icon-room': '&#xe630;',
		'icon-search': '&#xe632;',
		'icon-share': '&#xe6b6;',
		'icon-star-half': '&#xe6bc;',
		'icon-android': '&#xe602;',
		'icon-apps': '&#xe69c;',
		'icon-border-all': '&#xe670;',
		'icon-more-hollow': '&#xe603;',
		'icon-add-hasbg': '&#xe604;',
		'icon-add-single-large': '&#xe606;',
		'icon-add-single-middle': '&#xe607;',
		'icon-add-single-small': '&#xe608;',
		'icon-add-solid': '&#xe609;',
		'icon-checkbox-checked': '&#xea52;',
		'icon-checked-hasbg-large': '&#xe60a;',
		'icon-checkbox-unchecked': '&#xea53;',
		'icon-unchecked1': '&#xe60b;',
		'icon-right-solid': '&#xe60f;',
		'icon-right-hollow': '&#xe610;',
		'icon-checkmark': '&#xea10;',
		'icon-checkmark2': '&#xea11;',
		'icon-cancel-large': '&#xe611;',
		'icon-cancel-small': '&#xe612;',
		'icon-cansel-mini': '&#xe613;',
		'icon-cancel-hasbg1': '&#xe614;',
		'icon-cancel-hasbg12': '&#xe615;',
		'icon-cancel-circle': '&#xea0d;',
		'icon-plus-nobg': '&#xe616;',
		'icon-nosign-hollow': '&#xe617;',
		'icon-arrow-down': '&#xea36;',
		'icon-arrow-up': '&#xea32;',
		'icon-arrow-down-left': '&#xea37;',
		'icon-arrow-down-right': '&#xea35;',
		'icon-arrow-up-left': '&#xea31;',
		'icon-arrow-up-right': '&#xea33;',
		'icon-arrow-left': '&#xea38;',
		'icon-arrow-right': '&#xea34;',
		'icon-arrow-down-left2': '&#xea3f;',
		'icon-arrow-down-right2': '&#xea3d;',
		'icon-arrow-down2': '&#xea3e;',
		'icon-arrow-up2': '&#xea3a;',
		'icon-arrow-left2': '&#xea40;',
		'icon-arrow-right2': '&#xea3c;',
		'icon-arrow-up-left2': '&#xea39;',
		'icon-arrow-up-right2': '&#xea3b;',
		'icon-redo2': '&#xe966;',
		'icon-undo2': '&#xe965;',
		'icon-redo22': '&#xe968;',
		'icon-undo22': '&#xe967;',
		'icon-forward2': '&#xe969;',
		'icon-reply2': '&#xe96a;',
		'icon-left2': '&#xe61b;',
		'icon-right': '&#xe61d;',
		'icon-left22': '&#xe61e;',
		'icon-right2': '&#xe622;',
		'icon-skip-next': '&#xe623;',
		'icon-skip-previous': '&#xe624;',
		'icon-next2': '&#xea24;',
		'icon-previous2': '&#xea23;',
		'icon-play3': '&#xea1c;',
		'icon-circle-down': '&#xea43;',
		'icon-circle-up': '&#xea41;',
		'icon-circle-left': '&#xea44;',
		'icon-circle-right': '&#xea42;',
		'icon-next': '&#xea19;',
		'icon-previous': '&#xea18;',
		'icon-addgroup-hollow': '&#xe625;',
		'icon-addgroup-hollow-large': '&#xe626;',
		'icon-addlinkman-hollow': '&#xe627;',
		'icon-addlinkman-small': '&#xe628;',
		'icon-address-book': '&#xe944;',
		'icon-linkman-solid': '&#xe629;',
		'icon-linkman-hollow': '&#xe62a;',
		'icon-user-solid': '&#xe62b;',
		'icon-user-hollow': '&#xe62d;',
		'icon-bubble': '&#xe96b;',
		'icon-bubble2': '&#xe96e;',
		'icon-bubbles': '&#xe96c;',
		'icon-bubbles3': '&#xe96f;',
		'icon-speech-bubble': '&#xe62e;',
		'icon-alarm': '&#xe950;',
		'icon-timer': '&#xe62f;',
		'icon-history2': '&#xe94d;',
		'icon-bullhorn': '&#xe91a;',
		'icon-lightbulb': '&#xe631;',
		'icon-link2': '&#xe9cb;',
		'icon-black-hollow': '&#xe633;',
		'icon-black-solid': '&#xe634;',
		'icon-bookmark': '&#xe9d2;',
		'icon-bookmarks': '&#xe9d3;',
		'icon-calendar': '&#xe953;',
		'icon-camera-hollow': '&#xe635;',
		'icon-camera-solid': '&#xe636;',
		'icon-download3': '&#xe9c7;',
		'icon-upload3': '&#xe9c8;',
		'icon-upload-hollow': '&#xe637;',
		'icon-upload-solid': '&#xe638;',
		'icon-cog': '&#xe994;',
		'icon-cogs': '&#xe995;',
		'icon-desktop1': '&#xe639;',
		'icon-mobile1': '&#xe63a;',
		'icon-phone': '&#xe942;',
		'icon-file-empty': '&#xe924;',
		'icon-file-text2': '&#xe926;',
		'icon-files-empty': '&#xe925;',
		'icon-copy': '&#xe92c;',
		'icon-disign-solid': '&#xe63b;',
		'icon-disign-hollow': '&#xe63c;',
		'icon-alldoc-solid': '&#xe63d;',
		'icon-alldoc-hollow': '&#xe63e;',
		'icon-docsigned2-hollow': '&#xe63f;',
		'icon-docsigned2-solid': '&#xe640;',
		'icon-draftdoc-hollow': '&#xe642;',
		'icon-draftdoc-solid': '&#xe648;',
		'icon-administrate-password': '&#xe649;',
		'icon-setpassword': '&#xe64a;',
		'icon-singledoc-solid': '&#xe64b;',
		'icon-singledoc-hollow': '&#xe64c;',
		'icon-eye': '&#xe9ce;',
		'icon-eye-blocked': '&#xe9d1;',
		'icon-eye-minus': '&#xe9d0;',
		'icon-eye-plus': '&#xe9cf;',
		'icon-file-code': '&#xe64e;',
		'icon-file-excel': '&#xeadd;',
		'icon-file-music': '&#xe928;',
		'icon-file-pdf': '&#xeada;',
		'icon-file-picture': '&#xe927;',
		'icon-file-play': '&#xe929;',
		'icon-file-powerpoint': '&#xe64f;',
		'icon-file-video': '&#xe92a;',
		'icon-file-word': '&#xeadc;',
		'icon-file-zip': '&#xe92b;',
		'icon-newspaper': '&#xe904;',
		'icon-folder2': '&#xe92f;',
		'icon-folder-plus': '&#xe931;',
		'icon-folder-minus': '&#xe932;',
		'icon-folder-upload': '&#xe934;',
		'icon-folder-download': '&#xe933;',
		'icon-ownsign-solid': '&#xe651;',
		'icon-ownsign-hollow': '&#xe652;',
		'icon-share2': '&#xea7d;',
		'icon-gift': '&#xe99f;',
		'icon-library': '&#xe921;',
		'icon-home': '&#xe900;',
		'icon-home2': '&#xe901;',
		'icon-image': '&#xe90d;',
		'icon-images': '&#xe90e;',
		'icon-info2': '&#xea0c;',
		'icon-tip1': '&#xe653;',
		'icon-tip2': '&#xe659;',
		'icon-blocked': '&#xea0e;',
		'icon-key': '&#xe98d;',
		'icon-lock-single': '&#xe65c;',
		'icon-lock-solid': '&#xe65e;',
		'icon-lock-hollow': '&#xe662;',
		'icon-makesignature-hollow': '&#xe663;',
		'icon-makesignature-solid': '&#xe664;',
		'icon-message-large': '&#xe665;',
		'icon-message-middle': '&#xe66a;',
		'icon-message-small': '&#xe66b;',
		'icon-email-solid': '&#xe66c;',
		'icon-icons_email_normal2': '&#xe66f;',
		'icon-email-hollow': '&#xe671;',
		'icon-pen': '&#xe908;',
		'icon-sign-hasbg': '&#xe672;',
		'icon-sign-nobg': '&#xe675;',
		'icon-sign-nobg-small': '&#xe677;',
		'icon-write-down': '&#xe678;',
		'icon-pen-large': '&#xe679;',
		'icon-pen-middle': '&#xe67a;',
		'icon-pen-small': '&#xe681;',
		'icon-plus-hasbg': '&#xe682;',
		'icon-plus-solid': '&#xe684;',
		'icon-power': '&#xe685;',
		'icon-price-tag': '&#xe935;',
		'icon-price-tags': '&#xe936;',
		'icon-printer': '&#xe954;',
		'icon-radio-checked': '&#xea54;',
		'icon-radio-checked2': '&#xea55;',
		'icon-radio-unchecked': '&#xea56;',
		'icon-loop2': '&#xea2e;',
		'icon-refresh-hasbg': '&#xe686;',
		'icon-search-hollow': '&#xe687;',
		'icon-search2': '&#xe986;',
		'icon-zoom-in': '&#xe987;',
		'icon-zoom-out': '&#xe988;',
		'icon-shopping': '&#xe688;',
		'icon-enlarge': '&#xe989;',
		'icon-shrink': '&#xe98a;',
		'icon-enlarge2': '&#xe98b;',
		'icon-shrink2': '&#xe98c;',
		'icon-signature-hollow': '&#xe68d;',
		'icon-signature-solid': '&#xe68e;',
		'icon-sphere': '&#xe9c9;',
		'icon-left': '&#xe68f;',
		'icon-star1-bg': '&#xe690;',
		'icon-star-large': '&#xe691;',
		'icon-star-large-full': '&#xe692;',
		'icon-stop': '&#xea17;',
		'icon-stop2': '&#xea1e;',
		'icon-tarsh-think': '&#xe693;',
		'icon-trash-hollow': '&#xe694;',
		'icon-trash-solid': '&#xe695;',
		'icon-bin': '&#xe9ac;',
		'icon-bin2': '&#xe9ad;',
		'icon-tencent-weibo': '&#xe696;',
		'icon-qq': '&#xe697;',
		'icon-wechat': '&#xe698;',
		'icon-apple': '&#xeabf;',
		'icon-qrcode': '&#xe938;',
		'icon-toggle-off': '&#xe69a;',
		'icon-toggle-on': '&#xe69b;',
		'icon-umbrella1': '&#xe69e;',
		'icon-thumbnail-hollow': '&#xe6a1;',
		'icon-thumbnail-solid': '&#xe6a2;',
		'icon-list-hollow': '&#xe6a3;',
		'icon-list-solid': '&#xe6a4;',
		'icon-zone-hollow': '&#xe6a5;',
		'icon-zone-solid': '&#xe6a6;',
		'icon-envelope': '&#xe6c1;',
		'icon-search3': '&#xe6bf;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());