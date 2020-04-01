function adoptPupil(pupilID) {
    $.get("adoptPupil.py", {"pupilID": pupilID}, function(data) {
	$("#adoptMsg").html(data);
    });
}
