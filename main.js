function exportExcel(key) {
    window.location.href='/data/file/download?key=' + key;
} 

function getFormJson(form) {
    var o = {};
    var a = $(form).serializeArray();
    $.each(a, function () {
    if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
    } else {
        o[this.name] = this.value || '';
        }
    });
    return o;
}

$(function()
{
    $(".form_datetime").datetimepicker({
        format: "yyyy-mm-dd",
        minView: "month",
        showMeridian: true,
        autoclose: true,
        todayBtn: true
    });

    $('.export_data').on('click', function(event) {
        event.preventDefault();
        const url = window.location.pathname;
        const data = getFormJson($(this).closest('form'));
        $.ajax({
            url,
            type: 'post',
            data: data,
            beforeSend: function () {
                const journalId = data.journal_id;
                if (journalId == 0) {
                    const startDate = data.start;
                    const endDate = data.end;
                    const fromDate = new Date(startDate);
                    const toDate = new Date(endDate);
                    const diff = toDate.getTime() - fromDate.getTime();
                    const years = Math.floor(diff / (24 * 3600 * 1000 * 366) * 10) / 10;
                    if (years >= 10) {
                        $('#date_error').addClass("error").html("If you select all journals, please do not select more than one year,thanks!");
                        return false;
                    }else {
                        $('#date_error').html('').removeClass("error");
                        return true;
                    }
                }

                $("#preparing-file-modal").dialog({modal: true});
            },
            success: function(res){
                $("#preparing-file-modal").dialog('close');
                //'39a6ee9bc0dcbc59e8fa82cfd122cecf'
                if (typeof(res)=='string' && res.length == 32) {
                    exportExcel(res);
                }else {
                    if(typeof(res)=='object' && res.result == 0) {
                        for (var key in res.data) {
                            $('.error').remove();
                            $("#form_"+key).after('<p class="error">'+res.data[key]+'</p>');
                        }
                    } else {
                        $(".export_error").html("<font color='red'>(Export excel failed,please contact IT(Zhihao Jiao OR Xiangyang Yuan))</font>");
                    }
                }
            },
            complete: function(){
                $("#preparing-file-modal").dialog('close');
            },
            error:function(){
                $("#error-modal").dialog({ modal: true });
            }
        });
    });

    $('.language').on('click', function (e) {
        e.preventDefault();
        var url = $(this).data('url');
        $.ajax({
            url: url,
            method: 'get',
            error: function(err) {
              alert("{{'Failed!'|trans}}");
              window.location.href=location.href;
            },
            success: function(res) {
                window.location.href=location.href;
            }
        });
    });

});

function search_editor() {
    let email = $(".header_email_search").val();
    $.ajax({
        url: "/data/open/editor/informations?emails="+email+"&key=19a09e65508739e4a1b3f17da7594b21",
        data: email,
        type: 'get',
        dateType: 'json',
        beforeSend: function () {
            $("#preparing-search-modal").dialog({ modal: true });
            $('.modal-body').empty();
        },
        success: function (res) {
            $("#preparing-search-modal").dialog('close');
            $('#editor_modal_email').modal();
            $('#myModalLabel_editor').text('Show Editors Relevant informations:'+email);
            $.each(res, function(roles, informations) {
                if ('roles' === roles) {
                    $('.modal-body').append("<h4>EBM Roles</h4>");
                    $.each(informations, function (role, information) {
                        $('.modal-body').append("<p>"+information['role_name']+" of "+information['journal']+"</p>");
                    });
                }
                if ('edited_si' === roles) {
                    $('.modal-body').append("<h4>GE Roles</h4>");
                    $.each(informations, function (role, information) {
                        $('.modal-body').append("<p>"+information['role_name']+" of "+information['journal']+" ("+information['title']+")</p>");
                    });
                }
                if ('edited_publications' === roles) {
                    $('.modal-body').append("<h4>Editor Decisions</h4>");
                    $.each(informations, function (role, information) {
                        $('.modal-body').append("<p>"+information['journal']+" numbers is"+information['number']+"</p>");
                    });
                }
                if ('reviewed_publications' === roles) {
                    $('.modal-body').append("<h4>Editor Reviewed Publications</h4>");
                    $.each(informations, function (role, information) {
                        for(var i=0; i<information.length; i++){
                            $('.modal-body').append("<p>In"+role+" numbers is "+information[i]['number']+" of "+information[i]['journal']+"</p>");
                        }
                    });
                }
            });
        },
        complete: function(){
            $("#preparing-search-modal").dialog('close');
        },
        error:function(){
            $("#error-modal").dialog({ modal: true });
        }
    });
}
