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
                                            'data-bs-target="#controllers-links-module-AppModule-c88e3a805a36f1313796572fff48544ea982e330d7ddf6f877181380ce7532ec55edfa4fe84f60077a54bb1d23cb262b53f5e06a477ae648819157c879be00ce"' : 'data-bs-target="#xs-controllers-links-module-AppModule-c88e3a805a36f1313796572fff48544ea982e330d7ddf6f877181380ce7532ec55edfa4fe84f60077a54bb1d23cb262b53f5e06a477ae648819157c879be00ce"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-c88e3a805a36f1313796572fff48544ea982e330d7ddf6f877181380ce7532ec55edfa4fe84f60077a54bb1d23cb262b53f5e06a477ae648819157c879be00ce"' :
                                            'id="xs-controllers-links-module-AppModule-c88e3a805a36f1313796572fff48544ea982e330d7ddf6f877181380ce7532ec55edfa4fe84f60077a54bb1d23cb262b53f5e06a477ae648819157c879be00ce"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ArticleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArticleController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ArticleSearchController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArticleSearchController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/TagController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TagController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-c88e3a805a36f1313796572fff48544ea982e330d7ddf6f877181380ce7532ec55edfa4fe84f60077a54bb1d23cb262b53f5e06a477ae648819157c879be00ce"' : 'data-bs-target="#xs-injectables-links-module-AppModule-c88e3a805a36f1313796572fff48544ea982e330d7ddf6f877181380ce7532ec55edfa4fe84f60077a54bb1d23cb262b53f5e06a477ae648819157c879be00ce"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-c88e3a805a36f1313796572fff48544ea982e330d7ddf6f877181380ce7532ec55edfa4fe84f60077a54bb1d23cb262b53f5e06a477ae648819157c879be00ce"' :
                                        'id="xs-injectables-links-module-AppModule-c88e3a805a36f1313796572fff48544ea982e330d7ddf6f877181380ce7532ec55edfa4fe84f60077a54bb1d23cb262b53f5e06a477ae648819157c879be00ce"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ArticleSearchService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArticleSearchService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ArticleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArticleService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FileService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FileService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PushNotificationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PushNotificationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SentryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SentryService</a>
                                        </li>
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
                                    <a href="entities/TagEntity.html" data-type="entity-link" >TagEntity</a>
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
                                <a href="classes/CheckArticleType.html" data-type="entity-link" >CheckArticleType</a>
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
                                <a href="classes/StringToNumberPipe.html" data-type="entity-link" >StringToNumberPipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/TagDto.html" data-type="entity-link" >TagDto</a>
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
                                    <a href="injectables/EmailService.html" data-type="entity-link" >EmailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileService.html" data-type="entity-link" >FileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PushNotificationService.html" data-type="entity-link" >PushNotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SentryService.html" data-type="entity-link" >SentryService</a>
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