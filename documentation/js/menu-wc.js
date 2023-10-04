'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">news-backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-8fa9a57045fa6b0d7c363f1e7431e828bf40dae9eaaab0d65a83c6fa348c204d1613b03dfea8e15a6fb2c0517ddf801eb326c530f2beb8ab55a7c149f664725b"' : 'data-bs-target="#xs-controllers-links-module-AppModule-8fa9a57045fa6b0d7c363f1e7431e828bf40dae9eaaab0d65a83c6fa348c204d1613b03dfea8e15a6fb2c0517ddf801eb326c530f2beb8ab55a7c149f664725b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-8fa9a57045fa6b0d7c363f1e7431e828bf40dae9eaaab0d65a83c6fa348c204d1613b03dfea8e15a6fb2c0517ddf801eb326c530f2beb8ab55a7c149f664725b"' :
                                            'id="xs-controllers-links-module-AppModule-8fa9a57045fa6b0d7c363f1e7431e828bf40dae9eaaab0d65a83c6fa348c204d1613b03dfea8e15a6fb2c0517ddf801eb326c530f2beb8ab55a7c149f664725b"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-8fa9a57045fa6b0d7c363f1e7431e828bf40dae9eaaab0d65a83c6fa348c204d1613b03dfea8e15a6fb2c0517ddf801eb326c530f2beb8ab55a7c149f664725b"' : 'data-bs-target="#xs-injectables-links-module-AppModule-8fa9a57045fa6b0d7c363f1e7431e828bf40dae9eaaab0d65a83c6fa348c204d1613b03dfea8e15a6fb2c0517ddf801eb326c530f2beb8ab55a7c149f664725b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-8fa9a57045fa6b0d7c363f1e7431e828bf40dae9eaaab0d65a83c6fa348c204d1613b03dfea8e15a6fb2c0517ddf801eb326c530f2beb8ab55a7c149f664725b"' :
                                        'id="xs-injectables-links-module-AppModule-8fa9a57045fa6b0d7c363f1e7431e828bf40dae9eaaab0d65a83c6fa348c204d1613b03dfea8e15a6fb2c0517ddf801eb326c530f2beb8ab55a7c149f664725b"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/BasicStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BasicStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ArticleModule.html" data-type="entity-link" >ArticleModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ArticleModule-9f3dfccb67fb9a2ae2eed865af78c2bb628146187c0e8465cbe9c458ba31ff696effa0e4c49e8b87bfd033e49fcf2fb9502eca5fab02f5042024359998634425"' : 'data-bs-target="#xs-controllers-links-module-ArticleModule-9f3dfccb67fb9a2ae2eed865af78c2bb628146187c0e8465cbe9c458ba31ff696effa0e4c49e8b87bfd033e49fcf2fb9502eca5fab02f5042024359998634425"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ArticleModule-9f3dfccb67fb9a2ae2eed865af78c2bb628146187c0e8465cbe9c458ba31ff696effa0e4c49e8b87bfd033e49fcf2fb9502eca5fab02f5042024359998634425"' :
                                            'id="xs-controllers-links-module-ArticleModule-9f3dfccb67fb9a2ae2eed865af78c2bb628146187c0e8465cbe9c458ba31ff696effa0e4c49e8b87bfd033e49fcf2fb9502eca5fab02f5042024359998634425"' }>
                                            <li class="link">
                                                <a href="controllers/ArticleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArticleController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ArticleModule-9f3dfccb67fb9a2ae2eed865af78c2bb628146187c0e8465cbe9c458ba31ff696effa0e4c49e8b87bfd033e49fcf2fb9502eca5fab02f5042024359998634425"' : 'data-bs-target="#xs-injectables-links-module-ArticleModule-9f3dfccb67fb9a2ae2eed865af78c2bb628146187c0e8465cbe9c458ba31ff696effa0e4c49e8b87bfd033e49fcf2fb9502eca5fab02f5042024359998634425"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ArticleModule-9f3dfccb67fb9a2ae2eed865af78c2bb628146187c0e8465cbe9c458ba31ff696effa0e4c49e8b87bfd033e49fcf2fb9502eca5fab02f5042024359998634425"' :
                                        'id="xs-injectables-links-module-ArticleModule-9f3dfccb67fb9a2ae2eed865af78c2bb628146187c0e8465cbe9c458ba31ff696effa0e4c49e8b87bfd033e49fcf2fb9502eca5fab02f5042024359998634425"' }>
                                        <li class="link">
                                            <a href="injectables/ArticleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArticleService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ArticleSearchModule.html" data-type="entity-link" >ArticleSearchModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ArticleSearchModule-adf99dc1920f88329fb8405b65da8479d6133705b5737dc49517d5954238659652ad60ea9c33ed60630e51ae5f70ae3564c606240490792dd4d09557ed040787"' : 'data-bs-target="#xs-controllers-links-module-ArticleSearchModule-adf99dc1920f88329fb8405b65da8479d6133705b5737dc49517d5954238659652ad60ea9c33ed60630e51ae5f70ae3564c606240490792dd4d09557ed040787"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ArticleSearchModule-adf99dc1920f88329fb8405b65da8479d6133705b5737dc49517d5954238659652ad60ea9c33ed60630e51ae5f70ae3564c606240490792dd4d09557ed040787"' :
                                            'id="xs-controllers-links-module-ArticleSearchModule-adf99dc1920f88329fb8405b65da8479d6133705b5737dc49517d5954238659652ad60ea9c33ed60630e51ae5f70ae3564c606240490792dd4d09557ed040787"' }>
                                            <li class="link">
                                                <a href="controllers/ArticleSearchController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArticleSearchController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ArticleSearchModule-adf99dc1920f88329fb8405b65da8479d6133705b5737dc49517d5954238659652ad60ea9c33ed60630e51ae5f70ae3564c606240490792dd4d09557ed040787"' : 'data-bs-target="#xs-injectables-links-module-ArticleSearchModule-adf99dc1920f88329fb8405b65da8479d6133705b5737dc49517d5954238659652ad60ea9c33ed60630e51ae5f70ae3564c606240490792dd4d09557ed040787"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ArticleSearchModule-adf99dc1920f88329fb8405b65da8479d6133705b5737dc49517d5954238659652ad60ea9c33ed60630e51ae5f70ae3564c606240490792dd4d09557ed040787"' :
                                        'id="xs-injectables-links-module-ArticleSearchModule-adf99dc1920f88329fb8405b65da8479d6133705b5737dc49517d5954238659652ad60ea9c33ed60630e51ae5f70ae3564c606240490792dd4d09557ed040787"' }>
                                        <li class="link">
                                            <a href="injectables/ArticleSearchService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArticleSearchService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-e7ea3e7049c8c8c3a13eb51c987dca9acba9593aa75ea0818d196c9dcf824398c16ad3fbfe4e5716811c00d13f336cad2ce896d9f4f03d9dec185060685241f0"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-e7ea3e7049c8c8c3a13eb51c987dca9acba9593aa75ea0818d196c9dcf824398c16ad3fbfe4e5716811c00d13f336cad2ce896d9f4f03d9dec185060685241f0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-e7ea3e7049c8c8c3a13eb51c987dca9acba9593aa75ea0818d196c9dcf824398c16ad3fbfe4e5716811c00d13f336cad2ce896d9f4f03d9dec185060685241f0"' :
                                            'id="xs-controllers-links-module-AuthModule-e7ea3e7049c8c8c3a13eb51c987dca9acba9593aa75ea0818d196c9dcf824398c16ad3fbfe4e5716811c00d13f336cad2ce896d9f4f03d9dec185060685241f0"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-e7ea3e7049c8c8c3a13eb51c987dca9acba9593aa75ea0818d196c9dcf824398c16ad3fbfe4e5716811c00d13f336cad2ce896d9f4f03d9dec185060685241f0"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-e7ea3e7049c8c8c3a13eb51c987dca9acba9593aa75ea0818d196c9dcf824398c16ad3fbfe4e5716811c00d13f336cad2ce896d9f4f03d9dec185060685241f0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-e7ea3e7049c8c8c3a13eb51c987dca9acba9593aa75ea0818d196c9dcf824398c16ad3fbfe4e5716811c00d13f336cad2ce896d9f4f03d9dec185060685241f0"' :
                                        'id="xs-injectables-links-module-AuthModule-e7ea3e7049c8c8c3a13eb51c987dca9acba9593aa75ea0818d196c9dcf824398c16ad3fbfe4e5716811c00d13f336cad2ce896d9f4f03d9dec185060685241f0"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CronJobModule.html" data-type="entity-link" >CronJobModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CronJobModule-34e25c81b97823da057182005cc76c681a619bde518c4d77bd2c3514e2ab8943bee5b8fac445a390b222ca4698a019ab4a386bbf3d7bd92bc0e77dd902e8fccd"' : 'data-bs-target="#xs-injectables-links-module-CronJobModule-34e25c81b97823da057182005cc76c681a619bde518c4d77bd2c3514e2ab8943bee5b8fac445a390b222ca4698a019ab4a386bbf3d7bd92bc0e77dd902e8fccd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CronJobModule-34e25c81b97823da057182005cc76c681a619bde518c4d77bd2c3514e2ab8943bee5b8fac445a390b222ca4698a019ab4a386bbf3d7bd92bc0e77dd902e8fccd"' :
                                        'id="xs-injectables-links-module-CronJobModule-34e25c81b97823da057182005cc76c681a619bde518c4d77bd2c3514e2ab8943bee5b8fac445a390b222ca4698a019ab4a386bbf3d7bd92bc0e77dd902e8fccd"' }>
                                        <li class="link">
                                            <a href="injectables/CronJobService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CronJobService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EmailModule.html" data-type="entity-link" >EmailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EmailModule-49a25bcd3255d35f932e788debb5213526cc443927d0a27c873932d21100aed1b84f0a69f88b55f7612f46a5f7970058ebce7f3e16e280c6eb4e34d1360bb08f"' : 'data-bs-target="#xs-injectables-links-module-EmailModule-49a25bcd3255d35f932e788debb5213526cc443927d0a27c873932d21100aed1b84f0a69f88b55f7612f46a5f7970058ebce7f3e16e280c6eb4e34d1360bb08f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EmailModule-49a25bcd3255d35f932e788debb5213526cc443927d0a27c873932d21100aed1b84f0a69f88b55f7612f46a5f7970058ebce7f3e16e280c6eb4e34d1360bb08f"' :
                                        'id="xs-injectables-links-module-EmailModule-49a25bcd3255d35f932e788debb5213526cc443927d0a27c873932d21100aed1b84f0a69f88b55f7612f46a5f7970058ebce7f3e16e280c6eb4e34d1360bb08f"' }>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ExcelModule.html" data-type="entity-link" >ExcelModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ExcelModule-056f16271f1cc748a0e6736a85a2fe3c9581d120293282552aec1b3e4b13f809e0d5e571401b3cc0fc3aa98ce29a49fd4258b5b131e91207b5e15c5be0e80d52"' : 'data-bs-target="#xs-injectables-links-module-ExcelModule-056f16271f1cc748a0e6736a85a2fe3c9581d120293282552aec1b3e4b13f809e0d5e571401b3cc0fc3aa98ce29a49fd4258b5b131e91207b5e15c5be0e80d52"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ExcelModule-056f16271f1cc748a0e6736a85a2fe3c9581d120293282552aec1b3e4b13f809e0d5e571401b3cc0fc3aa98ce29a49fd4258b5b131e91207b5e15c5be0e80d52"' :
                                        'id="xs-injectables-links-module-ExcelModule-056f16271f1cc748a0e6736a85a2fe3c9581d120293282552aec1b3e4b13f809e0d5e571401b3cc0fc3aa98ce29a49fd4258b5b131e91207b5e15c5be0e80d52"' }>
                                        <li class="link">
                                            <a href="injectables/ExcelService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExcelService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FileModule.html" data-type="entity-link" >FileModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FileModule-cd5850b99e9ee7016c988b84374c9b3e88988ac5067d9d3bbfe18d6b23267c0dc6f284c84de9c6baf46882537b2dfd977d44fc69ef4216c07f21e4d082fb80d5"' : 'data-bs-target="#xs-injectables-links-module-FileModule-cd5850b99e9ee7016c988b84374c9b3e88988ac5067d9d3bbfe18d6b23267c0dc6f284c84de9c6baf46882537b2dfd977d44fc69ef4216c07f21e4d082fb80d5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FileModule-cd5850b99e9ee7016c988b84374c9b3e88988ac5067d9d3bbfe18d6b23267c0dc6f284c84de9c6baf46882537b2dfd977d44fc69ef4216c07f21e4d082fb80d5"' :
                                        'id="xs-injectables-links-module-FileModule-cd5850b99e9ee7016c988b84374c9b3e88988ac5067d9d3bbfe18d6b23267c0dc6f284c84de9c6baf46882537b2dfd977d44fc69ef4216c07f21e4d082fb80d5"' }>
                                        <li class="link">
                                            <a href="injectables/FileService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FileService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PushNotificationModule.html" data-type="entity-link" >PushNotificationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PushNotificationModule-282df2dbf2c1993dd734588a9a0a3d438458fb7929c93ff780e644ce522ab0d0ced21aa7a1ebef791fa9895fabc51b172521ba680a1f1efe132c765ef5b7e90c"' : 'data-bs-target="#xs-controllers-links-module-PushNotificationModule-282df2dbf2c1993dd734588a9a0a3d438458fb7929c93ff780e644ce522ab0d0ced21aa7a1ebef791fa9895fabc51b172521ba680a1f1efe132c765ef5b7e90c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PushNotificationModule-282df2dbf2c1993dd734588a9a0a3d438458fb7929c93ff780e644ce522ab0d0ced21aa7a1ebef791fa9895fabc51b172521ba680a1f1efe132c765ef5b7e90c"' :
                                            'id="xs-controllers-links-module-PushNotificationModule-282df2dbf2c1993dd734588a9a0a3d438458fb7929c93ff780e644ce522ab0d0ced21aa7a1ebef791fa9895fabc51b172521ba680a1f1efe132c765ef5b7e90c"' }>
                                            <li class="link">
                                                <a href="controllers/PushNotificationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PushNotificationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PushNotificationModule-282df2dbf2c1993dd734588a9a0a3d438458fb7929c93ff780e644ce522ab0d0ced21aa7a1ebef791fa9895fabc51b172521ba680a1f1efe132c765ef5b7e90c"' : 'data-bs-target="#xs-injectables-links-module-PushNotificationModule-282df2dbf2c1993dd734588a9a0a3d438458fb7929c93ff780e644ce522ab0d0ced21aa7a1ebef791fa9895fabc51b172521ba680a1f1efe132c765ef5b7e90c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PushNotificationModule-282df2dbf2c1993dd734588a9a0a3d438458fb7929c93ff780e644ce522ab0d0ced21aa7a1ebef791fa9895fabc51b172521ba680a1f1efe132c765ef5b7e90c"' :
                                        'id="xs-injectables-links-module-PushNotificationModule-282df2dbf2c1993dd734588a9a0a3d438458fb7929c93ff780e644ce522ab0d0ced21aa7a1ebef791fa9895fabc51b172521ba680a1f1efe132c765ef5b7e90c"' }>
                                        <li class="link">
                                            <a href="injectables/PushNotificationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PushNotificationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SentryModule.html" data-type="entity-link" >SentryModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SentryModule-a6d92d320d71775a5b7d4048ecf56e49aad073de2895f6b8b2d842726623f7958055f75fb566752f22fd576c216c2469b6e525d217e4b35090873da00c7801dc"' : 'data-bs-target="#xs-injectables-links-module-SentryModule-a6d92d320d71775a5b7d4048ecf56e49aad073de2895f6b8b2d842726623f7958055f75fb566752f22fd576c216c2469b6e525d217e4b35090873da00c7801dc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SentryModule-a6d92d320d71775a5b7d4048ecf56e49aad073de2895f6b8b2d842726623f7958055f75fb566752f22fd576c216c2469b6e525d217e4b35090873da00c7801dc"' :
                                        'id="xs-injectables-links-module-SentryModule-a6d92d320d71775a5b7d4048ecf56e49aad073de2895f6b8b2d842726623f7958055f75fb566752f22fd576c216c2469b6e525d217e4b35090873da00c7801dc"' }>
                                        <li class="link">
                                            <a href="injectables/SentryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SentryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TagGQLModule.html" data-type="entity-link" >TagGQLModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TagGQLModule-967b419a1f18ef5ffec60ee9233368e9ad75efc92b4f7aab235a7646708c6879252cd2545ebd2c83dcfa966c4ea74bd83893d7cf436a42d27872a6140f8c4e7a"' : 'data-bs-target="#xs-injectables-links-module-TagGQLModule-967b419a1f18ef5ffec60ee9233368e9ad75efc92b4f7aab235a7646708c6879252cd2545ebd2c83dcfa966c4ea74bd83893d7cf436a42d27872a6140f8c4e7a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TagGQLModule-967b419a1f18ef5ffec60ee9233368e9ad75efc92b4f7aab235a7646708c6879252cd2545ebd2c83dcfa966c4ea74bd83893d7cf436a42d27872a6140f8c4e7a"' :
                                        'id="xs-injectables-links-module-TagGQLModule-967b419a1f18ef5ffec60ee9233368e9ad75efc92b4f7aab235a7646708c6879252cd2545ebd2c83dcfa966c4ea74bd83893d7cf436a42d27872a6140f8c4e7a"' }>
                                        <li class="link">
                                            <a href="injectables/TagGQLService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TagGQLService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TagModule.html" data-type="entity-link" >TagModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TagModule-9c16c50327e23acdf5565c4106f094c8c0c042ee46c237c05e40407a4ce60f0f624e4bcac88ae8f7a25fb7a7d1e6f0b8c9fb4417600bd949c6a2b49a7a6c53de"' : 'data-bs-target="#xs-controllers-links-module-TagModule-9c16c50327e23acdf5565c4106f094c8c0c042ee46c237c05e40407a4ce60f0f624e4bcac88ae8f7a25fb7a7d1e6f0b8c9fb4417600bd949c6a2b49a7a6c53de"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TagModule-9c16c50327e23acdf5565c4106f094c8c0c042ee46c237c05e40407a4ce60f0f624e4bcac88ae8f7a25fb7a7d1e6f0b8c9fb4417600bd949c6a2b49a7a6c53de"' :
                                            'id="xs-controllers-links-module-TagModule-9c16c50327e23acdf5565c4106f094c8c0c042ee46c237c05e40407a4ce60f0f624e4bcac88ae8f7a25fb7a7d1e6f0b8c9fb4417600bd949c6a2b49a7a6c53de"' }>
                                            <li class="link">
                                                <a href="controllers/TagController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TagController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TagModule-9c16c50327e23acdf5565c4106f094c8c0c042ee46c237c05e40407a4ce60f0f624e4bcac88ae8f7a25fb7a7d1e6f0b8c9fb4417600bd949c6a2b49a7a6c53de"' : 'data-bs-target="#xs-injectables-links-module-TagModule-9c16c50327e23acdf5565c4106f094c8c0c042ee46c237c05e40407a4ce60f0f624e4bcac88ae8f7a25fb7a7d1e6f0b8c9fb4417600bd949c6a2b49a7a6c53de"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TagModule-9c16c50327e23acdf5565c4106f094c8c0c042ee46c237c05e40407a4ce60f0f624e4bcac88ae8f7a25fb7a7d1e6f0b8c9fb4417600bd949c6a2b49a7a6c53de"' :
                                        'id="xs-injectables-links-module-TagModule-9c16c50327e23acdf5565c4106f094c8c0c042ee46c237c05e40407a4ce60f0f624e4bcac88ae8f7a25fb7a7d1e6f0b8c9fb4417600bd949c6a2b49a7a6c53de"' }>
                                        <li class="link">
                                            <a href="injectables/TagService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TagService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ArticleController.html" data-type="entity-link" >ArticleController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ArticleSearchController.html" data-type="entity-link" >ArticleSearchController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PushNotificationController.html" data-type="entity-link" >PushNotificationController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TagController.html" data-type="entity-link" >TagController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/ArticleContentEntity.html" data-type="entity-link" >ArticleContentEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ArticleEntity.html" data-type="entity-link" >ArticleEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PushTokenEntity.html" data-type="entity-link" >PushTokenEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TagEntity.html" data-type="entity-link" >TagEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserEntity.html" data-type="entity-link" >UserEntity</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AllExceptionsFilter.html" data-type="entity-link" >AllExceptionsFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticleContentEntity.html" data-type="entity-link" >ArticleContentEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticleDto.html" data-type="entity-link" >ArticleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticleRequestDto.html" data-type="entity-link" >ArticleRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BadValidationRequestException.html" data-type="entity-link" >BadValidationRequestException</a>
                            </li>
                            <li class="link">
                                <a href="classes/CheckArticleTypePipe.html" data-type="entity-link" >CheckArticleTypePipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomValidationPipe.html" data-type="entity-link" >CustomValidationPipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorResponse.html" data-type="entity-link" >ErrorResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link" >HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Migrations1691261966905.html" data-type="entity-link" >Migrations1691261966905</a>
                            </li>
                            <li class="link">
                                <a href="classes/Migrations1691666064778.html" data-type="entity-link" >Migrations1691666064778</a>
                            </li>
                            <li class="link">
                                <a href="classes/Migrations1692270732657.html" data-type="entity-link" >Migrations1692270732657</a>
                            </li>
                            <li class="link">
                                <a href="classes/PushTokenDto.html" data-type="entity-link" >PushTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequiredParameterPipe.html" data-type="entity-link" >RequiredParameterPipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/StringToNumberPipe.html" data-type="entity-link" >StringToNumberPipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/TagDto.html" data-type="entity-link" >TagDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TagEntity.html" data-type="entity-link" >TagEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/TagResolver.html" data-type="entity-link" >TagResolver</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ArticleSearchService.html" data-type="entity-link" >ArticleSearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ArticleService.html" data-type="entity-link" >ArticleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BasicStrategy.html" data-type="entity-link" >BasicStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CronJobService.html" data-type="entity-link" >CronJobService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmailService.html" data-type="entity-link" >EmailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExcelService.html" data-type="entity-link" >ExcelService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileService.html" data-type="entity-link" >FileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStrategy.html" data-type="entity-link" >LocalStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PushNotificationService.html" data-type="entity-link" >PushNotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SentryService.html" data-type="entity-link" >SentryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TagGQLService.html" data-type="entity-link" >TagGQLService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TagService.html" data-type="entity-link" >TagService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtRequest.html" data-type="entity-link" >JwtRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadedFileDto.html" data-type="entity-link" >UploadedFileDto</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});