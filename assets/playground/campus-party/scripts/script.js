Ext.require([
    'Ext.form.*',
    'Ext.data.*',
    'Ext.window.MessageBox',
    'Ext.form.field.ComboBox'
]);

Ext.onReady(function () {
    Ext.define('State', {
        extend: 'Ext.data.Model',
        fields: [
            { type: 'string', name: 'userID' },
            { type: 'string', name: 'name' }
        ]
    });

    var store = Ext.create('Ext.data.Store', {
        model: 'State',
        data: window.classMates
    });

    function CreateInfoPanel(index) {
        var panel = new Ext.Window({
            title: ' 我 要 报 名',
            width: 570,
            bodyPadding: 5,
            closable: true,
            modal: true,
            resizable: false,
            items: [
        new Ext.FormPanel({
            width: 550,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'left',
                labelWidth: 45,
                margin: '0 0 0 10',
                msgTarget: 'none'
            },
            items: [
            {
                xtype: 'fieldset',
                title: '我的信息',
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                    xtype: 'fieldcontainer',
                    fieldLabel: '大名',
                    layout: 'hbox',
                    defaults: {
                        hideLabel: 'true'
                    },
                    items: [Ext.create('Ext.form.field.ComboBox', {
                        name: 'Name',
                        id: 'Name',
                        fieldLabel: '',
                        flex: 1,
                        emptyText: '请输入您的名字!',
                        blankText: '请输入您的名字!',
                        msgTarget: 'none',
                        store: store,
                        queryMode: 'local',
                        typeAhead: true,
                        allowBlank: false,
                        validateOnChange: true,
                        forceSelection: true,
                        valueField: 'userID',
                        displayField: 'name'
                    })]
                }, {
                    xtype: 'fieldcontainer',
                    fieldLabel: '电话',
                    emailText: '请输入您的电话！',
                    layout: 'hbox',
                    defaultType: 'textfield',
                    defaults: {
                        hideLabel: 'true'
                    },
                    items: [{
                        name: 'Phone',
                        flex: 1,
                        blankText: '请输入您的联系电话!',
                        value: index == null ? '' : window.classMates[index].phone,
                        allowBlank: false,
                        emptyText: '手机号码',
                        maskRe: /[\d\-]/,
                        regex: /^(13[0-9]|15[0|2|3|6|7|8|9]|18[8|9|6])\d{8}$/,
                        regexText: '请输入正确的手机号码！',
                        msgTarget: 'none'
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    fieldLabel: '电邮',
                    emailText: '请输入您的电邮地址！',
                    layout: 'hbox',
                    defaultType: 'textfield',
                    defaults: {
                        hideLabel: 'true'
                    },
                    items: [{
                        name: 'Email',
                        vtype: 'email',
                        emptyText: '电邮地址',
                        value: index == null ? '' : window.classMates[index].email,
                        flex: 1,
                        blankText: '请输入您的电邮地址!',
                        allowBlank: false,
                        msgTarget: 'none'
                    }]
                }]
            }, {
                xtype: 'fieldset',
                title: '纪念品',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: 45,
                    msgTarget: 'qtip'
                },
                items: [{
                    xtype: 'checkbox',
                    name: 'AllowPost',
                    boxLabel: ' 邮寄接收纪念品?',
                    hideLabel: true,
                    checked: index == null ? false : window.classMates[index].allowPost,
                    margin: '0 10 10 10',
                    handler: function (me, checked) {
                        var fieldset = me.ownerCt;
                        Ext.Array.forEach(fieldset.query('textfield'), function (field) {
                            field.setDisabled(!checked);
                            if (!Ext.isIE6) {
                                field.el.animate({ opacity: !checked ? .3 : 1 });
                            }
                        });
                    }
                }, {
                    xtype: 'textfield',
                    fieldLabel: '邮寄地址',
                    labelWidth: 75,
                    name: 'PostAddress',
                    blankText: '请输入您的邮寄地址!',
                    margin: '0 0 10 10',
                    allowBlank: false,
                    value: index == null ? '' : window.classMates[index].postAddress,
                    disabled: index == null ? true : !window.classMates[index].allowPost,
                    msgTarget: 'none'
                }, {
                    xtype: 'textfield',
                    fieldLabel: '邮政编码',
                    labelWidth: 75,
                    name: 'PostCode',
                    disabled: index == null ? true : !window.classMates[index].allowPost,
                    allowBlank: false,
                    maxLength: 6,
                    blankText: '请输入您的邮政编码!',
                    value: index == null ? '' : window.classMates[index].postCode,
                    enforceMaxLength: true,
                    maskRe: /[\d\-]/,
                    regex: /^[1-9]\d{5}$/,
                    regexText: '请输入正确的邮政编码！',
                    msgTarget: 'none'
                }]
            }, {
                xtype: 'fieldset',
                title: '还想留言',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                    xtype: 'textareafield',
                    name: 'MoreInfo',
                    maxLength: 400,
                    maxLengthText: '内容太多了~~~',
                    value: index == null ? '' : window.classMates[index].moreInfo,
                    allowBlank: true,
                    height: '200'
                }]
            }],
            buttons: [{
                text: ' 报 名 ',
                width: 100,
                height: 30,
                id: 'Post',
                handler: function () {

                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        var buttonCmp = Ext.getCmp('Post');
                        var buttonEl = buttonCmp.getEl();
                        var waitingPanel = Ext.core.DomHelper.createDom({ tag: 'div', id: 'loadingPanel', 'class': 'loadingPanel', children: [{ tag: 'img', src: 'themes/working.gif', 'class': 'workingImage'}] });
                        buttonEl.dom.parentNode.insertBefore(waitingPanel, buttonEl.dom);
                        buttonCmp.disable(true);
                        Ext.Ajax.request({
                            url: '?update=true&userID=' + Ext.getCmp('Name').value, //here same to your backend URL
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            method: 'post',
                            params: form.getValues(),
                            success: function (response, action) {
                                var value = Ext.decode(response.responseText);

                                buttonCmp.enable();
                                buttonEl.dom.parentNode.removeChild(waitingPanel);

                                var userID = Ext.getCmp('Name').value;
                                for (var i = 0; i < window.classMates.length; i++) {
                                    if (window.classMates[i].userID == userID && !window.classMates[i].isSaved) {
                                        var targetNode = $("#listContainer>span[index=" + i + "]");
                                        targetNode.prepend($("<img src='themes/icon.png' alt='' />"));
                                        break;
                                    }
                                }

                                window.classMates = value;

                                panel.close();
                                panel.destroy();
                            },
                            failure: function (response, action) {
                                Ext.MessageBox.alert('出错!', "更新出错！");
                                panel.close();
                                panel.destroy();
                            }
                        });
                    }
                }
            }]
        })]
        });
        return panel;
    }

    function ShowPost() {
        var index = this.getAttribute("index");
        var panel = CreateInfoPanel(index);
        panel.show();
        if (index != null) {
            Ext.getCmp('Name').select(window.classMates[index].userID);
        }
    }

    for (var i = 0; i < window.classMates.length; i++) {
        var node = $("<span></span>").html(window.classMates[i].name).attr("index", i).bind('click', ShowPost);
        if (window.classMates[i].isSaved) {
            node.prepend($("<img src='themes/icon.png' alt='' />"));
        }
        $("#listContainer").append(node);
    }

    $("#logo").bind('click', ShowPost);
    
    window.setInterval(function () {
        $("#nameList").animate({ scrollLeft: $("#nameList>div>span:first").width() + 10 }, 950, function () {
            var container = $("#nameList>div");
            container.find("span:first").remove().bind('click', ShowPost).appendTo(container);
            $("#nameList").scrollLeft(0);
        });
    }, 1000);
});

$(window).load(function () {
    $('#slider').nivoSlider({
        effect: 'random', // Specify sets like: 'fold,fade,sliceDown'
        slices: 15, // For slice animations
        boxCols: 8, // For box animations
        boxRows: 6, // For box animations
        animSpeed: 500, // Slide transition speed
        pauseTime: 3000, // How long each slide will show
        startSlide: 0, // Set starting Slide (0 index)
        directionNav: true, // Next & Prev navigation
        directionNavHide: true, // Only show on hover
        controlNav: false, // 1,2,3... navigation
        controlNavThumbs: false, // Use thumbnails for Control Nav
        controlNavThumbsFromRel: false, // Use image rel for thumbs
        controlNavThumbsSearch: '.jpg', // Replace this with...
        controlNavThumbsReplace: '_thumb.jpg', // ...this in thumb Image src
        keyboardNav: true, // Use left & right arrows
        pauseOnHover: true, // Stop animation while hovering
        manualAdvance: false, // Force manual transitions
        captionOpacity: 0.8, // Universal caption opacity
        prevText: 'Prev', // Prev directionNav text
        nextText: 'Next', // Next directionNav text
        randomStart: false, // Start on a random slide
        beforeChange: function () { }, // Triggers before a slide transition
        afterChange: function () { }, // Triggers after a slide transition
        slideshowEnd: function () { }, // Triggers after all slides have been shown
        lastSlide: function () { }, // Triggers when last slide is shown
        afterLoad: function () { } // Triggers when slider has loaded
    });
    $("#logo").hover(function () {
        var e = this;
        $(e).stop().animate({ marginTop: "100px" }, 250, function () {
            $(e).animate({ marginTop: "90px" }, 250);
        });
        $("#logo").find("img.shadow").stop().animate({ width: "80%", height: "10px", marginLeft: "8px", opacity: 0.25 }, 250);
    }, function () {
        var e = this;
        $(e).stop().animate({ marginTop: "100px" }, 250, function () {
            $(e).animate({ marginTop: "90px" }, 250);
        });
        $("#logo").find("img.shadow").stop().animate({ width: "100%", height: "16px", marginLeft: "0px", opacity: 1 }, 250);
    });
});
