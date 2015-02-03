// version 0.1
(function($) {
  $.fn.extend({
    onProgress: function(evt) {
      var obj=this.xparam;
      if(obj){
        if (evt.lengthComputable) {
          var value = Math.round(evt.loaded * 100 / evt.total);
          if(obj.options.progressbar){
            $(obj.options.progressbar).css('width',value+'%');
          }
          if(obj.options.progresscounter){
            $(obj.options.progresscounter).text(value+'%');
          }
        }else {
          if(obj.options.progressbar){
            $(obj.options.progressbar).css('width','50%');
          }
          if(obj.options.progresscounter){
            $(obj.options.progresscounter).text('-');
          }
        }
      }
    },
	  upload: function() {
      var len=this.filer[0].files.length;
      if(this.options.url && len >0){
        var name=this.options.name||'file';
        var fd = new FormData();
        if(this.options.multiple){
          for(var i=0;i<len;i++){
            fd.append(name+''+i, this.filer[0].files[i]);
          }
        }else{
          fd.append(name, this.filer[0].files[0]);
        }
        var xhr = new XMLHttpRequest();
        if(this.options.onProgress){
          xhr.upload.addEventListener("progress", this.options.onProgress, false);
        }else{
          xhr.upload.xparam=this;
          xhr.upload.addEventListener("progress", this.onProgress, false);
        }
        if(this.options.onCompleted){
          xhr.addEventListener("load", this.options.onCompleted, false);
        }
        if(this.options.onFailed){
          xhr.addEventListener("error", this.options.onFailed, false);
        }
        if(this.options.onCanceled){
          xhr.addEventListener("abort", this.options.onCanceled, false);
        }
        xhr.open("POST", this.options.url);
        xhr.send(fd);
      }
    },
	  uploader: function(options) {
      options=options||{};
      var w=$(this).width()||16;
      var h=$(this).height()||16;
      $(this).addClass('bpw-uploader-control');
      var wrap=$('<label class="bpw-uploader-wrapper"></label>');
      $(wrap).css('height',h+'px');
      $(wrap).css('width',w+'px');
      $(this).wrap(wrap);
      var filer=(options.multiple)?$('<input type="file" multiple="multiple">'):$('<input type="file" >');
      $(this).after(filer);
      this.filer=filer;
      this.options=options;
      var obj=this;

      $(filer).change(function(){
        var len=this.files.length;
        if(options.list && options.listformat){
          var list='';
          for(var i=0;i<len;i++){
            var file = this.files[i];
            if (file) {
              var fileSize = 0;
              if (file.size > 1024 * 1024)
                fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
              else
                fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
 
              var str=options.listformat;
              str=str.replace('<N>',file.name);     
              str=str.replace('<T>',file.type);     
              str=str.replace('<S>',fileSize);     
              list=list+str;
            }
          }
          $(options.list).html(list);
        }
        if(options.autosubmit){
          obj.upload();
        }
      });
      return obj;
	  },
  });
})(jQuery);

