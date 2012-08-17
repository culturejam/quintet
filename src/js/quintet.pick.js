/*
 * quintet.pick.js : all logic pertaining to Multiple Choice widget
 *
 * Copyright 2012 konijn@gmail.com aka Tom Demuyt
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 *jslint nomen: true, plusplus: true, sloppy: true, vars: true, white: true
 */

'use strict';

quintet.widgets.pick =
{
  id : "pick",

  /* Mandatory : all widgets must have a createOptions */
  /* These options will get serialized and stored in the backend for actual use */
  createOptions :   function()
  {
    var counter = $("."+this.id).length + 1;
    var o = quintet.widgets.line.createOptions(); //<-- Lean on line
    o.label = "Multiple Choice " + counter;
    o.name = "multiple_choice_" + counter;
    o.hint = '';
    o.value = 'First Choice';
    o.choices = "First Choice\nSecond Choice\nThird Choice";
    o.required = false;
    o.id = this.id;
    o.ref = this.id + counter;
    return o;
  },

  //Really, I am expecting the id to be
  //+1 for innerHTML
  createOptionsUI : function ( id , element )
  {

    var o = quintet.widget.decodeOptions( element );

    $("#"+id)[0].innerHTML =
      quintet.htmlbuilder
      .clear()
      .h3("Basics")
      .well()
        .table()
          .row()
            .cell().label("label")
            .cell("paddedStretch").textInput("label", o.label)
          .row()
            .cell().label("default")
            .cell("paddedStretch").textInput("value", o.value)
          .row()
        .table("stretch")
          .row()
            .cell("paddedStretch").colspan(2).label("hint").textArea("hint", o.hint).stretch()
          .row()
            .cell("paddedStretch").colspan(2).label("choices").textArea("choices", o.choices).stretch()
          .row()
        .table("stretch")
          .row("stretch")
            .cell().fontSelector("font")
            .cell().dropdown("size" , "x-small,small,medium,large,x-large" ).style("width:130px") //sizeSelector("size") x-small,small,medium,large,x-large
          .row()
            .cell().colspan(2)
              .checkbox("bold" , o.bold ).text("&nbsp;")
              .checkbox("italic" , o.italic ).text("&nbsp;")
              .checkbox("underline" , o.underline ).text("&nbsp;")
      .h3("Value")
      .well()
        .table()
          .row()
            .cell().checkbox("required" , o.required )
      .html;

      //For comments, see quintet.singletextfield.js
      $('#field\\.dummy\\.font').fontPickerRegios({
          defaultFont: 'Helvetica Neue',
          callbackFunc: function(fontName)
            {
              quintet.widget.applyOptions( $('#field\\.font').val(fontName)[0] );
            },
          selid: 'field\\.dummy\\.font'
      });

      //Init the font size
      $("#field\\.size").val( o.size );

      //Stretch the choices and chosen textarea
      $("#field\\.choices").attr( "rows" , 12 )
      $("#field\\.chosen").attr( "rows" , 12 )

      //Build the link from the option field back to the widget!
      quintet.widget.current = o.ref;
  },

  /* Mandatory : all widgets must have a create */
  /* This is what the drag helper function calls, magic will place then the helper in the sortable form */
  create : function( o /*options*/ )
  {
    //get options or create new options
    //this gets messed up, hence the go-around for the original self
    if( !o || (o instanceof jQuery.Event) )
      o = quintet.widgets.pick.createOptions();

    //use the style options of line
    quintet.widgets.line.styleOptions( o );

    //options creation
    var i, list;
    list = o.choices.split("\n");
    o._items = '';
    for( i = 0 ; i < list.length ; i++ ){
      var radio = {text: list[i], index: i, checked: o.value == list[i], name: o.name};
    	o._items = o._items + sprintf('<label class="radio">' +
                                    '<input type="radio" name="%(name)s" id="optionsRadios%(index)s" value="%(text)s">'+
                                    '%(text)s'+
                                    '</label>', radio);
    }

    o.data = quintet.widget.encodeOptions( o );


    //Return the element
    return $( sprintf('<div id="%(ref)s">%(_closeButton)s' +
                        '<input type="hidden" id="options" name="options" value=\'%(data)s\'>' +
                        '<div class="%(id)s widget">' +
                          '<label style="%(_style)s">%(_isRequired)s<span %(_labelColor)s >%(label)s</span></label>' +
                          '<div id="actual_%(ref)s">%(_items)s</div>' +
                          '<span class="formHint" %(_hintColor)s>%(hint)s</span>' +
                        '</div>' +
                    '</div>' , o )
      );
  },
  //Lets just hope that reinits are not too bad
  //When cloning this, consider grepping for postCreate
  postCreate : function(o)
  {
    $('input[value="' + o.value + '"]').attr("checked", true);
  }
};
