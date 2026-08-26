This is the page that opens after clicking on "Solve" in any problem.

```html
<div class="ui-card-content">


    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/2.2.0/anime.min.js"></script>
    <style>
        .medals{
            position: fixed;
            top: 0px;
            z-index:10001;
        }
        
        .svgsr{
            position: absolute;
            top: 0px;

        }
        .glowbronze{
            border-radius: 500rem;
            box-shadow: 0px 0px 50px 10px greenyellow;
        }
        .glowgold{
            border-radius: 500rem;
            box-shadow: 0px 0px 50px 10px greenyellow;
        }
        .glowsilver{
            border-radius: 500rem;
            box-shadow: 0px 0px 50px 10px greenyellow;
        }
    </style>

        
    <svg height="1" width="1" class="svgsr">
        <path id="animatePath" stroke-width="2"></path>
    </svg><div id="j_id_4g" class="ui-outputpanel ui-widget">
             <div class="card"><form id="j_id_4i" name="j_id_4i" method="post" action="/faces/candidate/codeprogram.xhtml" enctype="application/x-www-form-urlencoded"><nav id="j_id_4i:j_id_4j" class="ui-breadcrumb ui-module ui-widget ui-widget-header ui-helper-clearfix ui-corner-all" aria-label="Breadcrumb"><ol class="ui-breadcrumb-items"><li><a tabindex="0" class="ui-menuitem-link ui-corner-all ui-breadcrumb-home-icon ui-icon ui-icon-home" href="/faces/candidate/codeprogramgroup.xhtml?gt=CODETRACK" target="_self"><span class="ui-menuitem-text">Home</span></a></li><li><a tabindex="0" class="ui-menuitem-link ui-corner-all" href="#" onclick="PrimeFaces.addSubmitParam('j_id_4i',{'j_id_4i:j_id_4l':'j_id_4i:j_id_4l'}).submit('j_id_4i');return false;"><span class="ui-menuitem-text">KICKSTART for ABSOLUTE Beginner</span></a></li><li><a tabindex="0" aria-current="page" class="ui-menuitem-link ui-corner-all" href="#" onclick="PrimeFaces.addSubmitParam('j_id_4i',{'j_id_4i:j_id_4m':'j_id_4i:j_id_4m'}).submit('j_id_4i');return false;"><span class="ui-menuitem-text">KICKSTART (Code Solution)</span></a></li></ol></nav><input type="hidden" name="j_id_4i_SUBMIT" value="1"><input type="hidden" name="jakarta.faces.ViewState" id="j_id__v_0:jakarta.faces.ViewState:2" value="MmNiOTc1OGU2YTIxMWNlZDAwMDAwMDJi" autocomplete="off"></form>
                </div><div id="j_id_5x" class="ui-outputpanel ui-widget"><form id="code" name="code" method="post" action="/faces/candidate/codeprogram.xhtml" enctype="application/x-www-form-urlencoded"><span id="srmsg"></span><div id="j_id_61" class="ui-panelgrid ui-widget"><div id="j_id_61_content" class="ui-panelgrid-content ui-widget-content ui-grid ui-grid-responsive"><div class="ui-g"><div class="ui-panelgrid-cell ui-g-12 ui-md-6"><button id="j_id_62" name="j_id_62" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button-outlined" aria-label="" onclick="" type="submit"><span class="ui-button-text ui-c">Back To Challenges List</span></button></div><div class="ui-panelgrid-cell ui-g-12 ui-md-6"></div></div></div></div><div id="umsgnotifications" class="ui-outputpanel ui-widget"></div>
   
    <script src="https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/screenfull.js/5.1.0/screenfull.min.js"></script>
    <script src="/js/srack2.js"></script>
    <link type="text/css" rel="stylesheet" href="/css/srack4.css"><div id="programgrid" class="ui-panelgrid ui-widget psel"><div id="programgrid_content" class="ui-panelgrid-content ui-widget-content ui-grid ui-grid-responsive"><div class="ui-g"><div class="ui-panelgrid-cell ui-g-12 ui-md-6"><div id="j_id_6l" class="ui-card ui-widget ui-widget-content ui-corner-all"><div class="ui-card-body"><div class="ui-card-content">
                <div class="ui  ribbon label violet">KICKSTART SET001</div>

                <div class="ui label circular">ProgramID- 7864</div>

                <a class="ui image label ">
                    <img class="ui avatar image circular" src="https://cdn.skillrack.com/profilepic/30858/1410070895900skillrack.jpg">
                    SkillRack
                </a>
                <br><br>
                <div class="ui label">Print SkillRack as the Output</div>
                <br><br><p>The program must print <strong>SkillRack</strong> as the output.</p>

<p><strong><u>Note</u>:</strong> S and R are in upper case.</p>

                <br><br>
                <div class="ui label"> Max Execution Time Limit: 4000 millisecs</div></div></div></div></div><div class="ui-panelgrid-cell ui-g-12 ui-md-6"><div id="j_id_72" class="ui-card ui-widget ui-widget-content ui-corner-all"><div class="ui-card-body"><div class="ui-card-content"><div id="codeeditorpanel" class="ui-outputpanel ui-widget"><div id="j_id_74" class="ui-outputpanel ui-widget"><img id="j_id_75" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV4AAAAyCAIAAACbCCTYAAACEklEQVR4Xu3c0W7bMAwF0Pz/T3dYPAgsKcpy1qLOds4TdUm5fpASoA95PABe8xHUMAxu5XVgGv5UXpPaSt0ur93pwI6x8eUnwBeLZ7Ee7u6kdvkwPevx+Ys/dDozHT7qaSs9p0um812+SGq472/2wjdKR7M7qV1+WHS7Vnf9TvNkc75u7wa6PNVRnfl4GklUx2IOd5EOZXdGu/yw6HatkXcv0OXJ5nzd3g3s5B9BHauT0zoVcCP1XNbk0OWPi63jesQ8zXR3pj4qhev5uj2+xmadimkYu4tlLeAupodyGj76/NG3uvzQ3Y3TvEsuLUd4OOp1XotpGLuLZS3gFroT+d350N2N03y6rMl6WXUD9X3i5FHX5HRZC/h5i+PYtS7lO+H0OnUzXZ5086fJC3U08qOVliNJdSrgh/05zsE07+ZHfrTicoTJtBV2XMtjuGhNw5jHVgzXeUqqOjOeFp8Zi5gDb6ne4ZosXBoG3sn4nt/8th8zm/PA/2L/cwQAAAAAAAAAAAAAAAAAAAAAAAD414zfI0s/SdblC3HLpY3AvaTbO5Zdfslru4Db6S5zzWuSnA4Ab6O7zzWvSXI6ANzd898Cv23mRytHQeqO5yRxBriv7rqOPF/up8+zf8ZyBLyv7krXvCZDbX36IAnSGHAX6X6OZZcvkmHRAt5G9zXe5aObo6cuBwAAAAAAAAAAAAD4Gr8An2UaLRlfbG8AAAAASUVORK5CYII" alt=""><br><input id="capval" name="capval" type="text" value="" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" maxlength="10" size="5">
                        <br><br><span id="ptosolve"></span><button id="proceedbtn" name="proceedbtn" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button-outlined" aria-label="" onclick="PrimeFaces.bcn(this,event,[function(event){fscr()},function(event){PrimeFaces.ab({s:&quot;proceedbtn&quot;,f:&quot;code&quot;,p:&quot;proceedbtn,capval&quot;,u:&quot;programgrid,ptosolve&quot;,onco:function(xhr,status,args,data){hlt();;}});return false;}]);" type="submit"><span class="ui-button-text ui-c">Proceed to Solve the Program</span></button><button id="mp1" name="mp1" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" aria-label="" onclick="" style="display:none" type="submit"><span class="ui-button-text ui-c">OnBlur</span></button></div></div></div></div></div></div></div></div></div><div id="j_id_cn" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow ui-hidden-container ui-draggable ui-resizable" style="display: none; width: auto; height: auto;" role="dialog" aria-describedby="j_id_cn_content" aria-hidden="true" aria-modal="true" aria-labelledby="j_id_cn_title"><div class="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top ui-draggable-handle"><span id="j_id_cn_title" class="ui-dialog-title">Click the button below</span></div><div class="ui-dialog-content ui-widget-content" id="j_id_cn_content" style="height: auto;"><button id="j_id_co" name="j_id_co" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" aria-label="" onclick="fscr();                 PF('fscrDlg').hide();" type="button"><span class="ui-button-text ui-c">Go Full Screen</span></button></div><div class="ui-resizable-handle ui-resizable-n" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-w" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-ne" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-nw" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-sw" style="z-index: 90;"></div></div><input type="hidden" name="code_SUBMIT" value="1"><input type="hidden" name="jakarta.faces.ViewState" id="j_id__v_0:jakarta.faces.ViewState:3" value="MmNiOTc1OGU2YTIxMWNlZDAwMDAwMDJi" autocomplete="off"></form></div></div><form id="scheduleform" name="scheduleform" method="post" action="/faces/candidate/codeprogram.xhtml" enctype="application/x-www-form-urlencoded"><div id="scheduledialogid" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow ui-hidden-container ui-draggable ui-resizable" style="display: none; width: auto; height: auto;" role="dialog" aria-describedby="scheduledialogid_content" aria-hidden="true" aria-labelledby="scheduledialogid_title"><div class="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top ui-draggable-handle"><span id="scheduledialogid_title" class="ui-dialog-title">Programming Track Schedule</span><a href="#" class="ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all" aria-label="Close" role="button"><span class="ui-icon ui-icon-closethick"></span></a></div><div class="ui-dialog-content ui-widget-content" id="scheduledialogid_content" style="height: auto;"><div id="schedulepanel" class="ui-outputpanel ui-widget"><span class="ui label  circular black">KICKSTART (Code Solution)</span>

                    <br><br><span class="ui label  circular black">100 </span> wallet points will be used (deducted) <br> from your current 
                    account balance of <span class="ui label  circular black">0</span>
                    <br>  <br><div id="j_id_d2" class="ui-outputpanel ui-widget">
                        <p>
                            <b style="color:red">You DO NOT have sufficient wallet points to schedule the kit.<br> Click the button below to buy wallet points</b>
                        </p>

                        <p><a class="ui button primary " style="color:white" href="/faces/candidate/purchase.xhtml">Buy Wallet Points</a></p></div></div>
                <br>
                <button type="button" class="ui button blue" onclick="PF('scheduledialog').hide();">Close</button></div><div class="ui-resizable-handle ui-resizable-n" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-w" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-ne" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-nw" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-sw" style="z-index: 90;"></div></div><input type="hidden" name="scheduleform_SUBMIT" value="1"><input type="hidden" name="jakarta.faces.ViewState" id="j_id__v_0:jakarta.faces.ViewState:4" value="MmNiOTc1OGU2YTIxMWNlZDAwMDAwMDJi" autocomplete="off"></form><form id="kitdetailsform" name="kitdetailsform" method="post" action="/faces/candidate/codeprogram.xhtml" enctype="application/x-www-form-urlencoded"><div id="kitdetailsdialog" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow ui-hidden-container ui-draggable ui-resizable" style="overflow: scroll; max-height: 550px; display: none; width: auto; height: auto;" role="dialog" aria-describedby="kitdetailsdialog_content" aria-hidden="true" aria-labelledby="kitdetailsdialog_title"><div class="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top ui-draggable-handle"><span id="kitdetailsdialog_title" class="ui-dialog-title">Details</span><a href="#" class="ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all" aria-label="Close" role="button"><span class="ui-icon ui-icon-closethick"></span></a></div><div class="ui-dialog-content ui-widget-content" id="kitdetailsdialog_content" style="height: auto;"><span class="ui header">KICKSTART (Code Solution)</span>


                <div class="scrolling content"><p>This track contains 100 very easy level programs.</p>   

                    <div class="ui header black">Programs List</div>
                </div>

                <button type="button" class="ui button blue " onclick="PF('kitdetailsdialog').hide();">Close</button></div><div class="ui-resizable-handle ui-resizable-n" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-w" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-ne" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-nw" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-sw" style="z-index: 90;"></div></div><input type="hidden" name="kitdetailsform_SUBMIT" value="1"><input type="hidden" name="jakarta.faces.ViewState" id="j_id__v_0:jakarta.faces.ViewState:5" value="MmNiOTc1OGU2YTIxMWNlZDAwMDAwMDJi" autocomplete="off"></form>

    <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/sunburst.min.css">
    <script src="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>


    <script src="//cdn.jsdelivr.net/npm/highlightjs-line-numbers.js@2.7.0/dist/highlightjs-line-numbers.min.js"></script>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=default"></script>
    <script type="text/x-mathjax-config;executed=true">
        MathJax.Hub.Config({
        jax: ["input/TeX", "output/SVG"],
        extensions: ["tex2jax.js", "MathMenu.js", "MathZoom.js"],
        showMathMenu: false,
        showProcessingMessages: false,
        messageStyle: "none",
        SVG: {
        useGlobalCache: false
        },
        TeX: {
        extensions: ["AMSmath.js", "AMSsymbols.js", "autoload-all.js"]
        },
        });





    </script>


    <script>

        hljs.initHighlightingOnLoad();
// hljs.initLineNumbersOnLoad();
    </script>
    <script type="text/javascript">
      
        
        function hlt() {
            $('pre').each(function () {
                codesnip=$(this).html();
                $(this).html(codesnip.replace(/<br\s*\/?>/gi, '\n'));
                hljs.highlightBlock(this);
                // hljs.lineNumbersBlock(this);
            });



            mjx();
        }

        function hltline() {
            $('pre').each(function () {
                codesnip=$(this).html();
                $(this).html(codesnip.replace(/<br\s*\/?>/gi, '\n'));
                hljs.highlightBlock(this);
                hljs.lineNumbersBlock(this);
            });
        }

        hlt();

        function mjx() {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }
    </script>



        <script type="text/javascript">
            $(document).ready(function () {
                $(document).bind("cut copy paste", function (e) {
                    e.preventDefault();
                });

            });

        </script></div>
```

The challenging part in thie page is to solve the captcha by parsing text from the image. But its easy to solve by using any powerful and efficient library or maybe without library at all since the image looks easy to be parsed and we need to simple addition. After parsing it will be something like:

```
2117230020199@rgit

33+7=
```

So we can just add numbers -- the first number is before `+` and the second number is between `+` and `=`. After addition, we can just submit the form with the captcha result by clicking "Proceed to solve the program".

After submitting the captcha, we can solve the program by seeing the solution.

### DOM after solving the captcha

```html
<div class="ui-card-content">


    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/2.2.0/anime.min.js"></script>
    <style>
        .medals{
            position: fixed;
            top: 0px;
            z-index:10001;
        }
        
        .svgsr{
            position: absolute;
            top: 0px;

        }
        .glowbronze{
            border-radius: 500rem;
            box-shadow: 0px 0px 50px 10px greenyellow;
        }
        .glowgold{
            border-radius: 500rem;
            box-shadow: 0px 0px 50px 10px greenyellow;
        }
        .glowsilver{
            border-radius: 500rem;
            box-shadow: 0px 0px 50px 10px greenyellow;
        }
    </style>

        
    <svg height="1" width="1" class="svgsr">
        <path id="animatePath" stroke-width="2"></path>
    </svg><div id="j_id_4g" class="ui-outputpanel ui-widget">
             <div class="card"><form id="j_id_4i" name="j_id_4i" method="post" action="/faces/candidate/codeprogram.xhtml" enctype="application/x-www-form-urlencoded"><nav id="j_id_4i:j_id_4j" class="ui-breadcrumb ui-module ui-widget ui-widget-header ui-helper-clearfix ui-corner-all" aria-label="Breadcrumb"><ol class="ui-breadcrumb-items"><li><a tabindex="0" class="ui-menuitem-link ui-corner-all ui-breadcrumb-home-icon ui-icon ui-icon-home" href="/faces/candidate/codeprogramgroup.xhtml?gt=CODETRACK" target="_self"><span class="ui-menuitem-text">Home</span></a></li><li><a tabindex="0" class="ui-menuitem-link ui-corner-all" href="#" onclick="PrimeFaces.addSubmitParam('j_id_4i',{'j_id_4i:j_id_4l':'j_id_4i:j_id_4l'}).submit('j_id_4i');return false;"><span class="ui-menuitem-text">KICKSTART for ABSOLUTE Beginner</span></a></li><li><a tabindex="0" aria-current="page" class="ui-menuitem-link ui-corner-all" href="#" onclick="PrimeFaces.addSubmitParam('j_id_4i',{'j_id_4i:j_id_4m':'j_id_4i:j_id_4m'}).submit('j_id_4i');return false;"><span class="ui-menuitem-text">KICKSTART (Code Solution)</span></a></li></ol></nav><input type="hidden" name="j_id_4i_SUBMIT" value="1"><input type="hidden" name="jakarta.faces.ViewState" id="j_id__v_0:jakarta.faces.ViewState:2" value="NWZlNGU5ZmRmMzM3M2QyMDAwMDAwMDJm" autocomplete="off"></form>
                </div><div id="j_id_5x" class="ui-outputpanel ui-widget"><form id="code" name="code" method="post" action="/faces/candidate/codeprogram.xhtml" enctype="application/x-www-form-urlencoded"><span id="srmsg"></span><div id="j_id_61" class="ui-panelgrid ui-widget"><div id="j_id_61_content" class="ui-panelgrid-content ui-widget-content ui-grid ui-grid-responsive"><div class="ui-g"><div class="ui-panelgrid-cell ui-g-12 ui-md-6"><button id="j_id_62" name="j_id_62" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button-outlined" aria-label="" onclick="" type="submit"><span class="ui-button-text ui-c">Back To Challenges List</span></button></div><div class="ui-panelgrid-cell ui-g-12 ui-md-6"></div></div></div></div><div id="umsgnotifications" class="ui-outputpanel ui-widget"></div>
   
    <script src="https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/screenfull.js/5.1.0/screenfull.min.js"></script>
    <script src="/js/srack2.js"></script>
    <link type="text/css" rel="stylesheet" href="/css/srack4.css"><div id="programgrid" class="ui-panelgrid ui-widget psel"><div id="programgrid_content" class="ui-panelgrid-content ui-widget-content ui-grid ui-grid-responsive"><div class="ui-g"><div class="ui-panelgrid-cell ui-g-12 ui-md-6"><div id="j_id_6l" class="ui-card ui-widget ui-widget-content ui-corner-all"><div class="ui-card-body"><div class="ui-card-content">
                <div class="ui  ribbon label violet">KICKSTART SET001</div>

                <div class="ui label circular">ProgramID- 7864</div>

                <a class="ui image label ">
                    <img class="ui avatar image circular" src="https://cdn.skillrack.com/profilepic/30858/1410070895900skillrack.jpg">
                    SkillRack
                </a>
                <br><br>
                <div class="ui label">Print SkillRack as the Output</div>
                <br><br><p>The program must print <strong>SkillRack</strong> as the output.</p>

<p><strong><u>Note</u>:</strong> S and R are in upper case.</p>

                <br><br>
                <div class="ui label"> Max Execution Time Limit: 4000 millisecs</div></div></div></div></div><div class="ui-panelgrid-cell ui-g-12 ui-md-6"><div id="j_id_72" class="ui-card ui-widget ui-widget-content ui-corner-all"><div class="ui-card-body"><div class="ui-card-content"><div id="codeeditorpanel" class="ui-outputpanel ui-widget"><div id="j_id_7j" class="ui-outputpanel ui-widget">
                        <div align="right"><div id="j_id_7l" class="ui-panelgrid ui-widget"><div id="j_id_7l_content" class="ui-panelgrid-content ui-widget-content ui-grid ui-grid-responsive"><div class="ui-g"><div class="ui-panelgrid-cell ui-g-12 ui-md-2"><button id="j_id_7q" name="j_id_7q" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only rounded-button ui-button-secondary ui-button-outlined" aria-label="" onclick="" type="submit"><span class="ui-button-icon-left ui-icon ui-c pi pi-arrow-down"></span><span class="ui-button-text ui-c">ui-button</span></button></div><div class="ui-panelgrid-cell ui-g-12 ui-md-2">
    
    
           
            <select onchange="selectTheme()" id="select_theme" class="ui dropdown">
                <optgroup label="Dark"><option value="ace/theme/ambiance">Ambiance</option><option value="ace/theme/chaos">Chaos</option><option value="ace/theme/clouds_midnight">Clouds Midnight</option><option value="ace/theme/cobalt">Cobalt</option><option value="ace/theme/idle_fingers">idle Fingers</option><option value="ace/theme/kr_theme">krTheme</option><option value="ace/theme/merbivore">Merbivore</option><option value="ace/theme/merbivore_soft">Merbivore Soft</option><option value="ace/theme/mono_industrial">Mono Industrial</option><option value="ace/theme/monokai">Monokai</option><option value="ace/theme/pastel_on_dark">Pastel on dark</option><option value="ace/theme/solarized_dark">Solarized Dark</option><option value="ace/theme/terminal">Terminal</option><option value="ace/theme/tomorrow_night">Tomorrow Night</option><option value="ace/theme/tomorrow_night_blue">Tomorrow Night Blue</option><option value="ace/theme/tomorrow_night_bright">Tomorrow Night Bright</option><option value="ace/theme/tomorrow_night_eighties">Tomorrow Night 80s</option><option value="ace/theme/twilight">Twilight</option><option value="ace/theme/vibrant_ink">Vibrant Ink</option></optgroup>
                <optgroup label="Bright">
                    <option value="ace/theme/chrome">Chrome</option><option value="ace/theme/clouds">Clouds</option><option value="ace/theme/crimson_editor">Crimson Editor</option><option value="ace/theme/dawn">Dawn</option><option value="ace/theme/dreamweaver">Dreamweaver</option><option value="ace/theme/eclipse">Eclipse</option><option value="ace/theme/github">GitHub</option><option value="ace/theme/iplastic">IPlastic</option><option value="ace/theme/solarized_light">Solarized Light</option><option value="ace/theme/textmate">TextMate</option><option value="ace/theme/tomorrow">Tomorrow</option><option value="ace/theme/xcode">XCode</option><option value="ace/theme/kuroir">Kuroir</option><option value="ace/theme/katzenmilch">KatzenMilch</option><option value="ace/theme/sqlserver">SQL Server</option></optgroup>
            </select>
    
    <br>
   

    <script>
        var input = document.getElementById("select_theme");
        function selectTheme() {
            var theme = input.options[input.selectedIndex].value;
            txtCode.setTheme(theme);
        }
        
    </script></div><div class="ui-panelgrid-cell ui-g-12 ui-md-2"><div id="langs" class="ui-selectonemenu ui-widget ui-state-default ui-corner-all" style="min-width: 110px;"><div class="ui-helper-hidden-accessible"><select id="langs_input" name="langs_input" tabindex="-1" autocomplete="off" aria-hidden="true" onchange="PrimeFaces.ab({s:&quot;langs&quot;,e:&quot;change&quot;,f:&quot;code&quot;,p:&quot;langs&quot;,u:&quot;codeeditorpanel&quot;,onst:function(cfg){if(PrimeFaces.widgets['spoll']) {                                                                                                                     PF('spoll').stop();                                                 };},onco:function(xhr,status,args,data){hlt();;}});"><option value="2" selected="selected" data-escape="true">C ( gcc 8.x)</option><option value="3" data-escape="true">CPP ( 17)</option><option value="9" data-escape="true">CPP23 (23)</option><option value="1" data-escape="true">Java ( 21.0)</option><option value="7" data-escape="true">Python3 (3.12)</option></select></div><span id="langs_label" class="ui-selectonemenu-label ui-inputfield ui-corner-all" tabindex="0" aria-controls="langs_panel" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-label="C ( gcc 8.x)">C ( gcc 8.x)</span><div class="ui-selectonemenu-trigger ui-state-default ui-corner-right"><span class="ui-icon ui-icon-triangle-1-s ui-c"></span></div></div></div></div></div></div> 
                        </div><div id="multifibpanel" class="ui-outputpanel ui-widget"></div><div id="j_id_8i" class="ui-outputpanel ui-widget">
                            <table id="txtCodeTbl" class="padtbl" width="100%">
                                <tbody><tr>
                                    <td width="100%">
                                        <div id="codediv" style="width:100%"><textarea id="txtCode" name="txtCode" style="display:none" class="ui-inputfield ui-inputtextarea ui-widget ui-state-default ui-corner-all ui-inputtextarea-resizable" cols="20" rows="3" maxlength="2147483647">#include&lt;stdio.h&gt;
#include&lt;stdlib.h&gt;

int main()
{

}</textarea>


                                            <div id="ctracktxtCode" class=" ace_editor ace_hidpi ace-monokai ace_dark" style="font-size: 12pt; height: 126px;"><textarea class="ace_text-input" wrap="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="opacity: 0; font-size: 1px; height: 1px; width: 1px; transform: translate(46px, 18px);"></textarea><div class="ace_gutter" aria-hidden="true" style="left: 0px; width: 42px;"><div class="ace_layer ace_gutter-layer ace_folding-enabled" style="height: 1e+06px; transform: translate(0px, 0px); width: 42px;"><div class="ace_gutter-cell ace_gutter-active-line " style="height: 18px; top: 0px;">1<span style="display: none;"></span></div><div class="ace_gutter-cell " style="height: 18px; top: 18px;">2<span style="display: none;"></span></div><div class="ace_gutter-cell " style="height: 18px; top: 36px;">3<span style="display: none;"></span></div><div class="ace_gutter-cell " style="height: 18px; top: 54px;">4<span style="display: none;"></span></div><div class="ace_gutter-cell " style="height: 18px; top: 72px;">5<span style="display: inline-block; height: 18px;" class="ace_fold-widget ace_start ace_open"></span></div><div class="ace_gutter-cell " style="height: 18px; top: 90px;">6<span style="display: none;"></span></div><div class="ace_gutter-cell " style="height: 18px; top: 108px;">7<span style="display: none;"></span></div></div></div><div class="ace_scroller" style="line-height: 18px; left: 42px; right: 0px; bottom: 0px;"><div class="ace_content" style="transform: translate(0px, 0px); width: 516px; height: 162px;"><div class="ace_layer ace_print-margin-layer"><div class="ace_print-margin" style="left: 721px; visibility: visible;"></div></div><div class="ace_layer ace_marker-layer"><div class="ace_active-line" style="height: 18px; top: 0px; left: 0px; right: 0px;"></div></div><div class="ace_layer ace_text-layer" style="height: 1e+06px; margin: 0px 4px; transform: translate(0px, 0px);"><div class="ace_line_group" style="height: 18px; top: 0px;"><div class="ace_line" style="height: 18px;"><span class="ace_keyword">#include</span><span class="ace_constant ace_other">&lt;stdio.h&gt;</span></div></div><div class="ace_line_group" style="height: 18px; top: 18px;"><div class="ace_line" style="height: 18px;"><span class="ace_keyword">#include</span><span class="ace_constant ace_other">&lt;stdlib.h&gt;</span></div></div><div class="ace_line_group" style="height: 18px; top: 36px;"><div class="ace_line" style="height: 18px;"></div></div><div class="ace_line_group" style="height: 18px; top: 54px;"><div class="ace_line" style="height: 18px;"><span class="ace_storage ace_type">int</span> <span class="ace_identifier">main</span><span class="ace_paren ace_lparen">(</span><span class="ace_paren ace_rparen">)</span></div></div><div class="ace_line_group" style="height: 18px; top: 72px;"><div class="ace_line" style="height: 18px;"><span class="ace_paren ace_lparen">{</span></div></div><div class="ace_line_group" style="height: 18px; top: 90px;"><div class="ace_line" style="height: 18px;"></div></div><div class="ace_line_group" style="height: 18px; top: 108px;"><div class="ace_line" style="height: 18px;"><span class="ace_paren ace_rparen">}</span></div></div></div><div class="ace_layer ace_marker-layer"></div><div class="ace_layer ace_cursor-layer ace_hidden-cursors"><div class="ace_cursor" style="display: block; transform: translate(4px, 0px); width: 9px; height: 18px;"></div></div></div></div><div class="ace_scrollbar ace_scrollbar-v" style="display: none; width: 20px; bottom: 0px;"><div class="ace_scrollbar-inner" style="width: 20px; height: 126px;">&nbsp;</div></div><div class="ace_scrollbar ace_scrollbar-h" style="display: none; height: 20px; left: 42px; right: 0px;"><div class="ace_scrollbar-inner" style="height: 20px; width: 516px;">&nbsp;</div></div><div style="height: auto; width: auto; top: 0px; left: 0px; visibility: hidden; position: absolute; white-space: pre; font: inherit; overflow: hidden;"><div style="height: auto; width: auto; top: 0px; left: 0px; visibility: hidden; position: absolute; white-space: pre; font: inherit; overflow: visible;">הההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההה</div><div style="height: auto; width: auto; top: 0px; left: 0px; visibility: hidden; position: absolute; white-space: pre; font-style: inherit; font-variant: inherit; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-size-adjust: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-language-override: inherit; overflow: visible;">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div></div></div>
   

    <script>
        //<![CDATA[ 
        txtCode = ace.edit("ctracktxtCode");
        txtCode.setTheme("ace/theme/monokai");
        txtCode.getSession().setMode("ace/mode/c_cpp");
        txtCode.getSession().setUseWrapMode(true);
        txtCode.setOptions({
            enableBasicAutocompletion: false,
            enableSnippets: false,
            enableLiveAutocompletion: false,
            fontSize: "12pt",
            tabSize: 4,
            highlightSelectedWord: true,
            wrapBehavioursEnabled: false,
            enableMultiselect:false,
            readOnly: false,
            minLines: 5,
            maxLines: 500,
            showGutter:true
        });
        txtCode.$blockScrolling = 'Infinity';
        txtCode.getSession().setValue($("#txtCode").val());
        cpd = 0;


        //start for custom snippet and keywords
        var snippetUrl = "/ace/sracksnippetc_cpp.js";
        var keywordUrl = "/ace/srackkeywordc_cpp.js";
        //var snippetManager = ace.require("ace/snippets").snippetManager;
        var config = ace.require("ace/config");
        var langTools = ace.require("ace/ext/language_tools");


        //end for custom snippet and keywords

//]]>

    </script><div id="j_id_8z" class="ui-outputpanel ui-widget">
        <script>
            //<![CDATA[
            function resetEditorCode() {                
                txtCode.getSession().setValue($("#txtCode").val());
            }

            function cs() {
                
                var nowsnew = txtCode.getSession().getValue().replace(/\s/g, "");
                var nowsold = $("#txtCode").val().replace(/\s/g, "");
                var nlen = nowsnew.length;
                var olen = nowsold.length;
                var diff = nlen - olen;

                if (diff > 30) {
                    txtCode.getSession().setValue($("#txtCode").val());
                    return;
                } else {
                    if ("" !== txtCode.getSession().getValue()) {
                        $("#txtCode").val(txtCode.getSession().getValue());
                    }

                }
                
            }

            function listsnapshotsjson() {
            }

            txtCode.on("change", function (e) {

                if (true) {
                    var nowsnew = txtCode.getSession().getValue().replace(/\s/g, "");
                    var nowsold = $("#txtCode").val().replace(/\s/g, "");
                    var nlen = nowsnew.length;
                    var olen = nowsold.length;
                    var diff = nlen - olen;

                    if (diff > 30) {
                        txtCode.getSession().setValue($("#txtCode").val());
                        return;
                    } else {
                        if ("" !== txtCode.getSession().getValue()) {
                            $("#txtCode").val(txtCode.getSession().getValue());
                        }

                    }
                } else {
                    $("#txtCode").val(txtCode.getSession().getValue());
                }

                if ('html' === 'c_cpp') {
                    document.getElementById('htmldiv').innerHTML = txtCode.getSession().getValue();
                }

            });
            //]]>
        </script></div><div id="j_id_93" class="ui-outputpanel ui-widget">
        <script type="text/javascript">

        txtCode.commands.addCommand({ name: 'bte', bindKey: 'ctrl-c|ctrl-v|ctrl-x|ctrl-z|ctrl-shift-v|shift-del|cmd-c|cmd-v|cmd-x|alt-shift-down|alt-shift-up', exec: function() {} });

            txtCode.commands.on("exec", function (e) {

                if (e.command.name === "paste") {
                    e.preventDefault();
                    e.stopPropagation();
                }

            });
            
           

            txtCode.container.addEventListener("drop", function (e) {
                e.stopPropagation();
                e.preventDefault();
            }, true);

            $(document).ready(function () {
                $(document).bind("cut copy paste", function (e) {
                    e.preventDefault();
                });
            });


        </script></div><span class="ui label black">2117230020199@rgit</span><br>
                                        </div>

                                    </td>

                                </tr>

                            </tbody></table></div>



                        <br><br><div id="progresspanel" class="ui-outputpanel ui-widget"></div>


                        <br><table class="ui-noborder"><tbody><tr><td>
                                <div class="btn-group" id="btngrp"><table class="padtbl"><tbody><tr><td><button id="j_id_bf" name="j_id_bf" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button-outlined" aria-label="" onclick="PrimeFaces.bcn(this,event,[function(event){cs();},function(event){PrimeFaces.ab({s:&quot;j_id_bf&quot;,f:&quot;code&quot;,p:&quot;txtCode,j_id_bf&quot;,u:&quot;srmsg&quot;});return false;}]);" type="submit"><span class="ui-button-text ui-c">Save</span></button></td><td><button id="j_id_bg" name="j_id_bg" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button-outlined" aria-label="" onclick="PrimeFaces.bcn(this,event,[function(event){oncompile();},function(event){PrimeFaces.ab({s:&quot;j_id_bg&quot;,f:&quot;code&quot;,p:&quot;txtCode,langs,customtcpanel,j_id_bg&quot;,u:&quot;progresspanel,srmsg&quot;});return false;}]);" type="submit"><span class="ui-button-text ui-c">Run</span></button></td><td><div id="snappoll" style="display: none;"></div></td></tr><tr><td><span id="j_id_bi" class="ui-idlemonitor"></span></td><td></td><td></td></tr></tbody></table>

                                </div></td></tr></tbody></table>


                        <br><div id="j_id_bm" class="ui-outputpanel ui-widget"><table class="padtbl"><tbody><tr><td><div id="customtc" class="ui-selectbooleancheckbox ui-chkbox ui-widget"><div class="ui-helper-hidden-accessible"><input id="customtc_input" name="customtc_input" type="checkbox" aria-label="" onchange="PrimeFaces.ab({s:&quot;customtc&quot;,e:&quot;valueChange&quot;,f:&quot;code&quot;,p:&quot;customtc&quot;,u:&quot;customtcpanel&quot;});"></div><div class="ui-chkbox-box ui-widget ui-corner-all ui-state-default"><span class="ui-chkbox-icon ui-icon ui-icon-blank ui-c"></span></div></div></td><td>Run with a custom test case (Input/Output)</td></tr></tbody></table><div id="customtcpanel" class="ui-outputpanel ui-widget"></div></div><div id="j_id_bw" class="ui-outputpanel ui-widget"><div id="j_id_bx" role="separator" class="ui-divider ui-widget ui-divider-horizontal ui-divider-solid ui-divider-left"></div>

                                <button type="button" id="showbtn" class="ui button green" onclick="showSolution()">View Solution</button>
                                <button type="button" id="hidebtn" style="display:none" class="ui button red" onclick="hideSolution()">Hide Solution</button>

                            <div id="solndiv" style="display:none">  
                                <br>

                                <input id="currlangsoln" value="" style="display:none">
                                    <button type="button" class="ui button orange" onclick="showHideSoln('C')">
                                        C
                                    </button>
                                    <button type="button" class="ui button orange" onclick="showHideSoln('Java')">
                                        Java
                                    </button>
                                    <button type="button" class="ui button orange" onclick="showHideSoln('Python3')">
                                        Python3
                                    </button>
                                    <button type="button" class="ui button orange" onclick="showHideSoln('CPP23')">
                                        CPP23
                                    </button>
                                <br><br>

                                    <div id="solnC" style="display:none">
                                        <pre data-highlighted="yes" class="hljs language-cpp"><span class="hljs-meta">#<span class="hljs-keyword">include</span><span class="hljs-string">&lt;stdio.h&gt;</span></span>

<span class="hljs-function"><span class="hljs-type">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
</span>{
    <span class="hljs-built_in">printf</span>(<span class="hljs-string">"SkillRack"</span>);
}

&nbsp;
</pre>
                                    </div>

                                    <div id="solnJava" style="display:none">
                                        <pre data-highlighted="yes" class="hljs language-java"><span class="hljs-keyword">import</span> java.util.*;

<span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">Hello</span> {

    <span class="hljs-keyword">public</span> <span class="hljs-keyword">static</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">main</span><span class="hljs-params">(String[] args)</span> {
        System.out.println(<span class="hljs-string">"SkillRack"</span>);
    }
}

&nbsp;
</pre>
                                    </div>

                                    <div id="solnPython3" style="display:none">
                                        <pre data-highlighted="yes" class="hljs language-bash"><span class="hljs-built_in">print</span>(<span class="hljs-string">'SkillRack'</span>)

&nbsp;
</pre>
                                    </div>

                                    <div id="solnCPP23" style="display:none">
                                        <pre data-highlighted="yes" class="hljs language-cpp"><span class="hljs-meta">#<span class="hljs-keyword">include</span> <span class="hljs-string">&lt;iostream&gt;</span></span>
<span class="hljs-keyword">using</span> <span class="hljs-keyword">namespace</span> std;

<span class="hljs-function"><span class="hljs-type">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
</span>{
    cout &lt;&lt; <span class="hljs-string">"SkillRack"</span>;
    <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
}

&nbsp;
</pre>
                                    </div>
                            </div></div><div id="hintsoln" class="ui-outputpanel ui-widget"></div></div></div></div></div></div></div></div></div></div><div id="j_id_cn" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow ui-hidden-container ui-draggable ui-resizable" style="display: none; width: auto; height: auto;" role="dialog" aria-describedby="j_id_cn_content" aria-hidden="true" aria-modal="true" aria-labelledby="j_id_cn_title"><div class="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top ui-draggable-handle"><span id="j_id_cn_title" class="ui-dialog-title">Click the button below</span></div><div class="ui-dialog-content ui-widget-content" id="j_id_cn_content" style="height: auto;"><button id="j_id_co" name="j_id_co" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" aria-label="" onclick="fscr();                 PF('fscrDlg').hide();" type="button"><span class="ui-button-text ui-c">Go Full Screen</span></button></div><div class="ui-resizable-handle ui-resizable-n" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-w" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-ne" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-nw" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-sw" style="z-index: 90;"></div></div><input type="hidden" name="code_SUBMIT" value="1"><input type="hidden" name="jakarta.faces.ViewState" id="j_id__v_0:jakarta.faces.ViewState:3" value="NWZlNGU5ZmRmMzM3M2QyMDAwMDAwMDJm" autocomplete="off"></form></div></div><form id="scheduleform" name="scheduleform" method="post" action="/faces/candidate/codeprogram.xhtml" enctype="application/x-www-form-urlencoded"><div id="scheduledialogid" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow ui-hidden-container ui-draggable ui-resizable" style="display: none; width: auto; height: auto;" role="dialog" aria-describedby="scheduledialogid_content" aria-hidden="true" aria-labelledby="scheduledialogid_title"><div class="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top ui-draggable-handle"><span id="scheduledialogid_title" class="ui-dialog-title">Programming Track Schedule</span><a href="#" class="ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all" aria-label="Close" role="button"><span class="ui-icon ui-icon-closethick"></span></a></div><div class="ui-dialog-content ui-widget-content" id="scheduledialogid_content" style="height: auto;"><div id="schedulepanel" class="ui-outputpanel ui-widget"><span class="ui label  circular black">KICKSTART (Code Solution)</span>

                    <br><br><span class="ui label  circular black">100 </span> wallet points will be used (deducted) <br> from your current 
                    account balance of <span class="ui label  circular black">0</span>
                    <br>  <br><div id="j_id_d2" class="ui-outputpanel ui-widget">
                        <p>
                            <b style="color:red">You DO NOT have sufficient wallet points to schedule the kit.<br> Click the button below to buy wallet points</b>
                        </p>

                        <p><a class="ui button primary " style="color:white" href="/faces/candidate/purchase.xhtml">Buy Wallet Points</a></p></div></div>
                <br>
                <button type="button" class="ui button blue" onclick="PF('scheduledialog').hide();">Close</button></div><div class="ui-resizable-handle ui-resizable-n" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-w" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-ne" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-nw" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-sw" style="z-index: 90;"></div></div><input type="hidden" name="scheduleform_SUBMIT" value="1"><input type="hidden" name="jakarta.faces.ViewState" id="j_id__v_0:jakarta.faces.ViewState:4" value="NWZlNGU5ZmRmMzM3M2QyMDAwMDAwMDJm" autocomplete="off"></form><form id="kitdetailsform" name="kitdetailsform" method="post" action="/faces/candidate/codeprogram.xhtml" enctype="application/x-www-form-urlencoded"><div id="kitdetailsdialog" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow ui-hidden-container ui-draggable ui-resizable" style="overflow: scroll; max-height: 550px; display: none; width: auto; height: auto;" role="dialog" aria-describedby="kitdetailsdialog_content" aria-hidden="true" aria-labelledby="kitdetailsdialog_title"><div class="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top ui-draggable-handle"><span id="kitdetailsdialog_title" class="ui-dialog-title">Details</span><a href="#" class="ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all" aria-label="Close" role="button"><span class="ui-icon ui-icon-closethick"></span></a></div><div class="ui-dialog-content ui-widget-content" id="kitdetailsdialog_content" style="height: auto;"><span class="ui header">KICKSTART (Code Solution)</span>


                <div class="scrolling content"><p>This track contains 100 very easy level programs.</p>   

                    <div class="ui header black">Programs List</div>
                </div>

                <button type="button" class="ui button blue " onclick="PF('kitdetailsdialog').hide();">Close</button></div><div class="ui-resizable-handle ui-resizable-n" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-w" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-ne" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-nw" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-sw" style="z-index: 90;"></div></div><input type="hidden" name="kitdetailsform_SUBMIT" value="1"><input type="hidden" name="jakarta.faces.ViewState" id="j_id__v_0:jakarta.faces.ViewState:5" value="NWZlNGU5ZmRmMzM3M2QyMDAwMDAwMDJm" autocomplete="off"></form>

    <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/sunburst.min.css">
    <script src="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>


    <script src="//cdn.jsdelivr.net/npm/highlightjs-line-numbers.js@2.7.0/dist/highlightjs-line-numbers.min.js"></script>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=default"></script>
    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
        jax: ["input/TeX", "output/SVG"],
        extensions: ["tex2jax.js", "MathMenu.js", "MathZoom.js"],
        showMathMenu: false,
        showProcessingMessages: false,
        messageStyle: "none",
        SVG: {
        useGlobalCache: false
        },
        TeX: {
        extensions: ["AMSmath.js", "AMSsymbols.js", "autoload-all.js"]
        },
        });





    </script>


    <script>

        hljs.initHighlightingOnLoad();
// hljs.initLineNumbersOnLoad();
    </script>
    <script type="text/javascript">
      
        
        function hlt() {
            $('pre').each(function () {
                codesnip=$(this).html();
                $(this).html(codesnip.replace(/<br\s*\/?>/gi, '\n'));
                hljs.highlightBlock(this);
                // hljs.lineNumbersBlock(this);
            });



            mjx();
        }

        function hltline() {
            $('pre').each(function () {
                codesnip=$(this).html();
                $(this).html(codesnip.replace(/<br\s*\/?>/gi, '\n'));
                hljs.highlightBlock(this);
                hljs.lineNumbersBlock(this);
            });
        }

        hlt();

        function mjx() {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }
    </script>



        <script type="text/javascript">
            $(document).ready(function () {
                $(document).bind("cut copy paste", function (e) {
                    e.preventDefault();
                });

            });

        </script></div>
```

We need to just store the C solution and then use it to fill the C code and then finally run the program to pass the test cases.

After successful sumbission, we can just easily go to next problem by clicking on "Proceed Next":

The Proceed Next will open the problems list again. Make sure we are not resubmitting any problems again and always solving new problems until the particular Set is over. After the Set is over we need to go to the next Set.

```html
<div class="ui-card-body"><div class="ui-card-content"><div id="codeeditorpanel" class="ui-outputpanel ui-widget"><div id="j_id_7j" class="ui-outputpanel ui-widget">
                        <div align="right"><div id="j_id_7l" class="ui-panelgrid ui-widget"><div id="j_id_7l_content" class="ui-panelgrid-content ui-widget-content ui-grid ui-grid-responsive"><div class="ui-g"><div class="ui-panelgrid-cell ui-g-12 ui-md-2"><button id="j_id_7q" name="j_id_7q" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only rounded-button ui-button-secondary ui-button-outlined" aria-label="" onclick="" type="submit"><span class="ui-button-icon-left ui-icon ui-c pi pi-arrow-down"></span><span class="ui-button-text ui-c">ui-button</span></button></div><div class="ui-panelgrid-cell ui-g-12 ui-md-2">
    
    
           
            <select onchange="selectTheme()" id="select_theme" class="ui dropdown">
                <optgroup label="Dark"><option value="ace/theme/ambiance">Ambiance</option><option value="ace/theme/chaos">Chaos</option><option value="ace/theme/clouds_midnight">Clouds Midnight</option><option value="ace/theme/cobalt">Cobalt</option><option value="ace/theme/idle_fingers">idle Fingers</option><option value="ace/theme/kr_theme">krTheme</option><option value="ace/theme/merbivore">Merbivore</option><option value="ace/theme/merbivore_soft">Merbivore Soft</option><option value="ace/theme/mono_industrial">Mono Industrial</option><option value="ace/theme/monokai">Monokai</option><option value="ace/theme/pastel_on_dark">Pastel on dark</option><option value="ace/theme/solarized_dark">Solarized Dark</option><option value="ace/theme/terminal">Terminal</option><option value="ace/theme/tomorrow_night">Tomorrow Night</option><option value="ace/theme/tomorrow_night_blue">Tomorrow Night Blue</option><option value="ace/theme/tomorrow_night_bright">Tomorrow Night Bright</option><option value="ace/theme/tomorrow_night_eighties">Tomorrow Night 80s</option><option value="ace/theme/twilight">Twilight</option><option value="ace/theme/vibrant_ink">Vibrant Ink</option></optgroup>
                <optgroup label="Bright">
                    <option value="ace/theme/chrome">Chrome</option><option value="ace/theme/clouds">Clouds</option><option value="ace/theme/crimson_editor">Crimson Editor</option><option value="ace/theme/dawn">Dawn</option><option value="ace/theme/dreamweaver">Dreamweaver</option><option value="ace/theme/eclipse">Eclipse</option><option value="ace/theme/github">GitHub</option><option value="ace/theme/iplastic">IPlastic</option><option value="ace/theme/solarized_light">Solarized Light</option><option value="ace/theme/textmate">TextMate</option><option value="ace/theme/tomorrow">Tomorrow</option><option value="ace/theme/xcode">XCode</option><option value="ace/theme/kuroir">Kuroir</option><option value="ace/theme/katzenmilch">KatzenMilch</option><option value="ace/theme/sqlserver">SQL Server</option></optgroup>
            </select>
    
    <br>
   

    <script>
        var input = document.getElementById("select_theme");
        function selectTheme() {
            var theme = input.options[input.selectedIndex].value;
            txtCode.setTheme(theme);
        }
        
    </script></div><div class="ui-panelgrid-cell ui-g-12 ui-md-2"><div id="langs" class="ui-selectonemenu ui-widget ui-state-default ui-corner-all" style="min-width: 110px;"><div class="ui-helper-hidden-accessible"><select id="langs_input" name="langs_input" tabindex="-1" autocomplete="off" aria-hidden="true" onchange="PrimeFaces.ab({s:&quot;langs&quot;,e:&quot;change&quot;,f:&quot;code&quot;,p:&quot;langs&quot;,u:&quot;codeeditorpanel&quot;,onst:function(cfg){if(PrimeFaces.widgets['spoll']) {                                                                                                                     PF('spoll').stop();                                                 };},onco:function(xhr,status,args,data){hlt();;}});"><option value="2" selected="selected" data-escape="true">C ( gcc 8.x)</option><option value="3" data-escape="true">CPP ( 17)</option><option value="9" data-escape="true">CPP23 (23)</option><option value="1" data-escape="true">Java ( 21.0)</option><option value="7" data-escape="true">Python3 (3.12)</option></select></div><span id="langs_label" class="ui-selectonemenu-label ui-inputfield ui-corner-all" tabindex="0" aria-controls="langs_panel" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-label="C ( gcc 8.x)">C ( gcc 8.x)</span><div class="ui-selectonemenu-trigger ui-state-default ui-corner-right"><span class="ui-icon ui-icon-triangle-1-s ui-c"></span></div></div></div></div></div></div> 
                        </div><div id="multifibpanel" class="ui-outputpanel ui-widget"></div><div id="j_id_8i" class="ui-outputpanel ui-widget">
                            <table id="txtCodeTbl" class="padtbl" width="100%" style="display: none;">
                                <tbody><tr>
                                    <td width="100%">
                                        <div id="codediv" style="width:100%"><textarea id="txtCode" name="txtCode" style="display:none" class="ui-inputfield ui-inputtextarea ui-widget ui-state-default ui-corner-all ui-inputtextarea-resizable" cols="20" rows="3" maxlength="2147483647">#include&lt;stdio.h&gt;
#include&lt;stdlib.h&gt;

int main()
{
    printf("SkillRack");
}</textarea>


                                            <div id="ctracktxtCode" class=" ace_editor ace_hidpi ace-monokai ace_dark" style="font-size: 12pt; height: 126px;"><textarea class="ace_text-input" wrap="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="opacity: 0; font-size: 1px; height: 1px; width: 1px; transform: translate(261px, 108px);"></textarea><div class="ace_gutter" aria-hidden="true" style="left: 0px; width: 42px;"><div class="ace_layer ace_gutter-layer ace_folding-enabled" style="height: 1e+06px; transform: translate(0px, 0px); width: 42px;"><div class="ace_gutter-cell " style="height: 18px; top: 0px;">1<span style="display: none;"></span></div><div class="ace_gutter-cell " style="height: 18px; top: 18px;">2<span style="display: none;"></span></div><div class="ace_gutter-cell " style="height: 18px; top: 36px;">3<span style="display: none;"></span></div><div class="ace_gutter-cell " style="height: 18px; top: 54px;">4<span style="display: none;"></span></div><div class="ace_gutter-cell " style="height: 18px; top: 72px;">5<span style="display: inline-block; height: 18px;" class="ace_fold-widget ace_start ace_open"></span></div><div class="ace_gutter-cell ace_gutter-active-line " style="height: 18px; top: 90px;">6<span style="display: none;"></span></div><div class="ace_gutter-cell " style="height: 18px; top: 108px;">7<span style="display: none;"></span></div></div></div><div class="ace_scroller" style="line-height: 18px; left: 42px; right: 0px; bottom: 0px;"><div class="ace_content" style="transform: translate(0px, 0px); width: 516px; height: 162px;"><div class="ace_layer ace_print-margin-layer"><div class="ace_print-margin" style="left: 721px; visibility: visible;"></div></div><div class="ace_layer ace_marker-layer"><div class="ace_active-line" style="height: 18px; top: 90px; left: 0px; right: 0px;"></div></div><div class="ace_layer ace_text-layer" style="height: 1e+06px; margin: 0px 4px; transform: translate(0px, 0px);"><div class="ace_line_group" style="height: 18px; top: 0px;"><div class="ace_line" style="height: 18px;"><span class="ace_keyword">#include</span><span class="ace_constant ace_other">&lt;stdio.h&gt;</span></div></div><div class="ace_line_group" style="height: 18px; top: 18px;"><div class="ace_line" style="height: 18px;"><span class="ace_keyword">#include</span><span class="ace_constant ace_other">&lt;stdlib.h&gt;</span></div></div><div class="ace_line_group" style="height: 18px; top: 36px;"><div class="ace_line" style="height: 18px;"></div></div><div class="ace_line_group" style="height: 18px; top: 54px;"><div class="ace_line" style="height: 18px;"><span class="ace_storage ace_type">int</span> <span class="ace_identifier">main</span><span class="ace_paren ace_lparen">(</span><span class="ace_paren ace_rparen">)</span></div></div><div class="ace_line_group" style="height: 18px; top: 72px;"><div class="ace_line" style="height: 18px;"><span class="ace_paren ace_lparen">{</span></div></div><div class="ace_line_group" style="height: 18px; top: 90px;"><div class="ace_line" style="height: 18px;">    <span class="ace_support ace_function ace_C99 ace_c">printf</span><span class="ace_paren ace_lparen">(</span><span class="ace_string ace_start">"</span><span class="ace_string">SkillRack</span><span class="ace_string ace_end">"</span><span class="ace_paren ace_rparen">)</span><span class="ace_punctuation ace_operator">;</span></div></div><div class="ace_line_group" style="height: 18px; top: 108px;"><div class="ace_line" style="height: 18px;"><span class="ace_paren ace_rparen">}</span></div></div></div><div class="ace_layer ace_marker-layer"></div><div class="ace_layer ace_cursor-layer ace_hidden-cursors"><div class="ace_cursor" style="display: block; transform: translate(219px, 90px); width: 9px; height: 18px; animation-duration: 1000ms;"></div></div></div></div><div class="ace_scrollbar ace_scrollbar-v" style="display: none; width: 20px; bottom: 0px;"><div class="ace_scrollbar-inner" style="width: 20px; height: 126px;">&nbsp;</div></div><div class="ace_scrollbar ace_scrollbar-h" style="display: none; height: 20px; left: 42px; right: 0px;"><div class="ace_scrollbar-inner" style="height: 20px; width: 516px;">&nbsp;</div></div><div style="height: auto; width: auto; top: 0px; left: 0px; visibility: hidden; position: absolute; white-space: pre; font: inherit; overflow: hidden;"><div style="height: auto; width: auto; top: 0px; left: 0px; visibility: hidden; position: absolute; white-space: pre; font: inherit; overflow: visible;">הההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההההה</div><div style="height: auto; width: auto; top: 0px; left: 0px; visibility: hidden; position: absolute; white-space: pre; font-style: inherit; font-variant: inherit; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-size-adjust: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-language-override: inherit; overflow: visible;">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div></div></div>
   

    <script>
        //<![CDATA[ 
        txtCode = ace.edit("ctracktxtCode");
        txtCode.setTheme("ace/theme/monokai");
        txtCode.getSession().setMode("ace/mode/c_cpp");
        txtCode.getSession().setUseWrapMode(true);
        txtCode.setOptions({
            enableBasicAutocompletion: false,
            enableSnippets: false,
            enableLiveAutocompletion: false,
            fontSize: "12pt",
            tabSize: 4,
            highlightSelectedWord: true,
            wrapBehavioursEnabled: false,
            enableMultiselect:false,
            readOnly: false,
            minLines: 5,
            maxLines: 500,
            showGutter:true
        });
        txtCode.$blockScrolling = 'Infinity';
        txtCode.getSession().setValue($("#txtCode").val());
        cpd = 0;


        //start for custom snippet and keywords
        var snippetUrl = "/ace/sracksnippetc_cpp.js";
        var keywordUrl = "/ace/srackkeywordc_cpp.js";
        //var snippetManager = ace.require("ace/snippets").snippetManager;
        var config = ace.require("ace/config");
        var langTools = ace.require("ace/ext/language_tools");


        //end for custom snippet and keywords

//]]>

    </script><div id="j_id_8z" class="ui-outputpanel ui-widget">
        <script>
            //<![CDATA[
            function resetEditorCode() {                
                txtCode.getSession().setValue($("#txtCode").val());
            }

            function cs() {
                
                var nowsnew = txtCode.getSession().getValue().replace(/\s/g, "");
                var nowsold = $("#txtCode").val().replace(/\s/g, "");
                var nlen = nowsnew.length;
                var olen = nowsold.length;
                var diff = nlen - olen;

                if (diff > 30) {
                    txtCode.getSession().setValue($("#txtCode").val());
                    return;
                } else {
                    if ("" !== txtCode.getSession().getValue()) {
                        $("#txtCode").val(txtCode.getSession().getValue());
                    }

                }
                
            }

            function listsnapshotsjson() {
            }

            txtCode.on("change", function (e) {

                if (true) {
                    var nowsnew = txtCode.getSession().getValue().replace(/\s/g, "");
                    var nowsold = $("#txtCode").val().replace(/\s/g, "");
                    var nlen = nowsnew.length;
                    var olen = nowsold.length;
                    var diff = nlen - olen;

                    if (diff > 30) {
                        txtCode.getSession().setValue($("#txtCode").val());
                        return;
                    } else {
                        if ("" !== txtCode.getSession().getValue()) {
                            $("#txtCode").val(txtCode.getSession().getValue());
                        }

                    }
                } else {
                    $("#txtCode").val(txtCode.getSession().getValue());
                }

                if ('html' === 'c_cpp') {
                    document.getElementById('htmldiv').innerHTML = txtCode.getSession().getValue();
                }

            });
            //]]>
        </script></div><div id="j_id_93" class="ui-outputpanel ui-widget">
        <script type="text/javascript">

        txtCode.commands.addCommand({ name: 'bte', bindKey: 'ctrl-c|ctrl-v|ctrl-x|ctrl-z|ctrl-shift-v|shift-del|cmd-c|cmd-v|cmd-x|alt-shift-down|alt-shift-up', exec: function() {} });

            txtCode.commands.on("exec", function (e) {

                if (e.command.name === "paste") {
                    e.preventDefault();
                    e.stopPropagation();
                }

            });
            
           

            txtCode.container.addEventListener("drop", function (e) {
                e.stopPropagation();
                e.preventDefault();
            }, true);

            $(document).ready(function () {
                $(document).bind("cut copy paste", function (e) {
                    e.preventDefault();
                });
            });


        </script></div><span class="ui label black">2117230020199@rgit</span><br>
                                        </div>

                                    </td>

                                </tr>

                            </tbody></table></div>



                        <br><br><div id="progresspanel" class="ui-outputpanel ui-widget"><div id="successmsg" class="ui-outputpanel ui-widget">
                                <span class="ui label green">Great! Your code has passed.</span><div id="j_id_9f" class="ui-card ui-widget ui-widget-content ui-corner-all"><div class="ui-card-body"><div class="ui-card-content">SUCCESS</div></div></div>
                                <h1>Congratulations! Your Code has passed.</h1>

                                <script type="text/javascript">
                                    hideCode();
                                    hideBtns();
                                </script>
                                <script type="text/javascript">


                                    const jsConfetti = new JSConfetti();
                                    var currIteration = 0;
                                    function shower() {


                                        jsConfetti.addConfetti({
                                            confettiRadius: 7,
                                            confettiNumber: 500

                                        });
                                        jsConfetti.addConfetti({
                                            emojis: ['🍿', '🎉️', '🏅', '🏆', '💕', '💯', '🔥', '🥁', '💖'],
                                            emojiSize: 40,
                                            confettiNumber: 50
                                        });



                                        if (currIteration < 10){
                                            currIteration++;
                                            setTimeout(shower, 2000);

                                        }
                                    }

                                    shower();
                                </script><button id="j_id_9i" name="j_id_9i" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button-raised" aria-label="" onclick="PrimeFaces.bcn(this,event,[function(event){if (PrimeFaces.widgets['spoll']) {                                             PF('spoll').stop();                                         }},function(event){}]);" type="submit"><span class="ui-button-text ui-c">Proceed Next</span></button></div></div>


                        <br><table class="ui-noborder"><tbody><tr><td>
                                <div class="btn-group" id="btngrp" style="display: none;"><table class="padtbl"><tbody><tr><td><button id="j_id_bf" name="j_id_bf" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button-outlined" aria-label="" onclick="PrimeFaces.bcn(this,event,[function(event){cs();},function(event){PrimeFaces.ab({s:&quot;j_id_bf&quot;,f:&quot;code&quot;,p:&quot;txtCode,j_id_bf&quot;,u:&quot;srmsg&quot;});return false;}]);" type="submit"><span class="ui-button-text ui-c">Save</span></button></td><td><button id="j_id_bg" name="j_id_bg" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button-outlined" aria-label="" onclick="PrimeFaces.bcn(this,event,[function(event){oncompile();},function(event){PrimeFaces.ab({s:&quot;j_id_bg&quot;,f:&quot;code&quot;,p:&quot;txtCode,langs,customtcpanel,j_id_bg&quot;,u:&quot;progresspanel,srmsg&quot;});return false;}]);" type="submit"><span class="ui-button-text ui-c">Run</span></button></td><td><div id="snappoll" style="display: none;"></div></td></tr><tr><td><span id="j_id_bi" class="ui-idlemonitor"></span></td><td></td><td></td></tr></tbody></table>

                                </div></td></tr></tbody></table>


                        <br><div id="j_id_bm" class="ui-outputpanel ui-widget"><table class="padtbl"><tbody><tr><td><div id="customtc" class="ui-selectbooleancheckbox ui-chkbox ui-widget"><div class="ui-helper-hidden-accessible"><input id="customtc_input" name="customtc_input" type="checkbox" aria-label="" onchange="PrimeFaces.ab({s:&quot;customtc&quot;,e:&quot;valueChange&quot;,f:&quot;code&quot;,p:&quot;customtc&quot;,u:&quot;customtcpanel&quot;});"></div><div class="ui-chkbox-box ui-widget ui-corner-all ui-state-default"><span class="ui-chkbox-icon ui-icon ui-icon-blank ui-c"></span></div></div></td><td>Run with a custom test case (Input/Output)</td></tr></tbody></table><div id="customtcpanel" class="ui-outputpanel ui-widget"></div></div><div id="j_id_bw" class="ui-outputpanel ui-widget"><div id="j_id_bx" role="separator" class="ui-divider ui-widget ui-divider-horizontal ui-divider-solid ui-divider-left"></div>

                                <button type="button" id="showbtn" class="ui button green" onclick="showSolution()">View Solution</button>
                                <button type="button" id="hidebtn" style="display:none" class="ui button red" onclick="hideSolution()">Hide Solution</button>

                            <div id="solndiv" style="display:none">  
                                <br>

                                <input id="currlangsoln" value="" style="display:none">
                                    <button type="button" class="ui button orange" onclick="showHideSoln('C')">
                                        C
                                    </button>
                                    <button type="button" class="ui button orange" onclick="showHideSoln('Java')">
                                        Java
                                    </button>
                                    <button type="button" class="ui button orange" onclick="showHideSoln('Python3')">
                                        Python3
                                    </button>
                                    <button type="button" class="ui button orange" onclick="showHideSoln('CPP23')">
                                        CPP23
                                    </button>
                                <br><br>

                                    <div id="solnC" style="display:none">
                                        <pre data-highlighted="yes" class="hljs language-cpp"><span class="hljs-meta">#<span class="hljs-keyword">include</span><span class="hljs-string">&lt;stdio.h&gt;</span></span>

<span class="hljs-function"><span class="hljs-type">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
</span>{
    <span class="hljs-built_in">printf</span>(<span class="hljs-string">"SkillRack"</span>);
}

&nbsp;
</pre>
                                    </div>

                                    <div id="solnJava" style="display:none">
                                        <pre data-highlighted="yes" class="hljs language-java"><span class="hljs-keyword">import</span> java.util.*;

<span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">Hello</span> {

    <span class="hljs-keyword">public</span> <span class="hljs-keyword">static</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">main</span><span class="hljs-params">(String[] args)</span> {
        System.out.println(<span class="hljs-string">"SkillRack"</span>);
    }
}

&nbsp;
</pre>
                                    </div>

                                    <div id="solnPython3" style="display:none">
                                        <pre data-highlighted="yes" class="hljs language-bash"><span class="hljs-built_in">print</span>(<span class="hljs-string">'SkillRack'</span>)

&nbsp;
</pre>
                                    </div>

                                    <div id="solnCPP23" style="display:none">
                                        <pre data-highlighted="yes" class="hljs language-cpp"><span class="hljs-meta">#<span class="hljs-keyword">include</span> <span class="hljs-string">&lt;iostream&gt;</span></span>
<span class="hljs-keyword">using</span> <span class="hljs-keyword">namespace</span> std;

<span class="hljs-function"><span class="hljs-type">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
</span>{
    cout &lt;&lt; <span class="hljs-string">"SkillRack"</span>;
    <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
}

&nbsp;
</pre>
                                    </div>
                            </div></div><div id="hintsoln" class="ui-outputpanel ui-widget"></div></div></div></div></div>
```

