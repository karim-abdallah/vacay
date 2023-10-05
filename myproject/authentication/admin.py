from django.contrib import admin

from authentication.models import *

# Register your models here.
admin.site.register(User)
admin.site.register(TimeOffSetting)
admin.site.register(Metric)
admin.site.register(Subscriptions)
admin.site.register(HolidaySetting)
admin.site.register(BookedDays)
admin.site.register(CompanyGsheetSource)