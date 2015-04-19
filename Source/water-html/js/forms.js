var Forms = {
               bind: function() {
                  // Add required class to inputs
                  $(':input[required]').addClass('required');
                  
                  // Block submit if there are invalid classes found
                  $('form:not(.html5enhanced)').addClass("html5enhanced").submit(function() {
                        var formEl = this;
                          $('input,textarea').each(function() {
                                  Forms.validate(this);
                          });
                          
                          if(($(this).find(".invalid").length) == 0){
                                  // Delete all placeholder text
                                  $('input,textarea').each(function() {
                                          if($(this).val() == $(this).attr('placeholder')) $(this).val('');
                                  });
                                  
                                  if($(formEl).hasClass('no-ajax')){
                                     $(formEl).submit();
                                  }
                                  //now submit form via ajax
                                  $.ajax({
                                    url: $(formEl).attr("action"),
                                    type: $(formEl).attr("method"),
                                    data: $(formEl).serialize(),
                                    success: function(r) {
                                       $(".success-message").slideDown('fast');
                                       $('html,body').stop().animate({
                                          scrollTop: $(".success-message").offset().top - 30
                                       }, 300);
                                       
                                       $(formEl).find('input[type="text"], input[type="email"], input[type="tel"], select').val('');
                                       $(formEl).find('textarea').val('');
                                       setTimeout(function(){
                                          $(".success-message").slideUp('fast');
                                       }, 7000);
                                    }
                                  })
                                  return false;
                          }else{
                                  return false;
                          }
                  });
         
               },
               is_email: function(value){
                 return (/^([a-z0-9])(([-a-z0-9._])*([a-z0-9]))*\@([a-z0-9])(([a-z0-9-])*([a-z0-9]))+(\.([a-z0-9])([-a-z0-9_-])?([a-z0-9])+)+$/).test(value);
               },
               is_url: function(value){
                       return (/^(http|https|ftp):\/\/([A-Z0-9][A-Z0-9_-]*(?:\.[A-Z0-9][A-Z0-9_-]*)+):?(\d+)?\/?/i).test(value);
               },
               is_number: function(value){
                       return (typeof(value) === 'number' || typeof(value) === 'string') && value !== '' && !isNaN(value);
               },
               validate: function(element) {
                  var $$ = $(element);
                  var validator = element.getAttribute('type'); // Using pure javascript because jQuery always returns text in none HTML5 browsers
                  var valid = true;
                  var apply_class_to = $$;
                  
                  //var required = element.getAttribute('required') == null ? false : true;
                  var required = element.getAttribute('required') == null ? false : true;
                  if(required){
                              $(element).addClass("required");
                  }
                  switch(validator){
                          case 'email': valid = Forms.is_email($$.val()); break;
                          case 'url': valid = Forms.is_url($$.val()); break;
                          case 'number': valid = Forms.is_number($$.val()); break;
                  }
                  
                  // Extra required validation
                  if(valid && required && $$.val().replace($$.attr('placeholder'), '') == ''){
                          valid = false;
                  }
                  
                  // Set input to valid of invalid
                  if(valid || (!required && $$.val() == '')){
                          apply_class_to.removeClass('invalid');
                          apply_class_to.addClass('valid');
                          return true;
                  }else{
                          apply_class_to.removeClass('valid');
                          apply_class_to.addClass('invalid');
                          return false;
                  }
               }
            }