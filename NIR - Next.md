# NIR - Next - Edits

# Phase 2A Frontend Tasks — Short Version

## Goal

Implement the new student auth flow with OTP, register/continue registration, deeplink, tenant dropdown, video player, quick quiz, and login history.

---

## 1. Auth Flow

### Register / Continue Registration

Use one flow only. No separate “Join Tenant” page.

Flow:

1. Student enters phone.
2. Send OTP:
   `POST /api/v1/auth/otp/send`
3. Verify OTP:
   `POST /api/v1/auth/auth/otp/verify`
4. Validation phone number for parent and student

Payload:

```json
{
  "phone": "010xxxxxxxx",
  "otp_code": "123456"
}
```

After OTP:

- If `is_new = true` → call `/auth/register`
- If `is_new = false` → call `/auth/join/prefill`, then `/auth/join`
- If `ALREADY_ENROLLED` → redirect to login

Register / Join payload:

```
{
  "phone":"010xxxxxxxx",
  "first_name":"Ahmed",
  "last_name":"Mohamed",
  "password":"12345678",
  "password_confirmation":"12345678",
  "grade_id":1
}
```

Important:

- Send `grade_id`, not grade text.
- If prefilled grade is invalid, force student to choose grade from current tenant.

---

## 2. After Auth Success

Applies after:

- `REGISTERED`
- `JOINED`
- `LOGIN`

Store:

- `access_token`
- `student`
- `enrollments`

Show “Open in App” button using:

```
nir://auth?token={deeplink_token}&tenant={tenant_slug}
```

Note:

- `deeplink_token` expires in 60 seconds.
- Use latest token only.

---

## 3. Profile Dropdown

Show:

- Student name + phone
- Current tenant
- All enrolled tenants
- Tenant code = `tenant.slug`
- Tenant domain
- Open tenant website
- Open in App for current tenant
- Login History link
- Logout

---

## 4. Profile Completion

For Phase 2A:

- Do not block user.
- Backend returns:
  - `profile_completed: false`
  - `missing_required: []`

For Phase 2B:

After auth, call profile fields endpoint and redirect to complete missing data if needed.

---

## 6. Quick Quiz Logic

Support quick quiz in lesson/video flow.

Flow:

1. Load quiz with lesson on specifc minute.
2. Student answers or skip.
3. Submit answers.
4. Backend decides pass/fail.

Handle:

- loading
- empty state
- submit disabled until answered
- result screen

---

## 7. Login History

Add link in profile dropdown:

`Profile → Login History`

Show:

- Device
- Tenant
- IP
- Login time
- Status

Backend endpoint

`GET /api/v1/auth/login-history`

---

## 8. Error Handling

| Code                 | Action                |
| -------------------- | --------------------- |
| `OTP_SENT`           | Show OTP input        |
| `OTP_VERIFIED`       | Continue form         |
| `OTP_INVALID`        | Show wrong OTP        |
| `OTP_LOCKED`         | Show lock message     |
| `PHONE_NOT_VERIFIED` | Restart OTP           |
| `REGISTERED`         | Auth success          |
| `JOINED`             | Auth success          |
| `ALREADY_ENROLLED`   | Redirect login        |
| `INVALID_GRADE`      | Select valid grade    |
| `INVALID_DEEPLINK`   | Manual login fallback |

---

## 9. Acceptance

- New student registers after OTP.
- Existing student continues registration on another tenant.
- Already enrolled student goes to login.
- OTP verify uses `otp_code`.
- Register/join sends `grade_id`.
- Open in App deeplink works.
- Profile dropdown shows enrolled tenants.
- Video views count correctly.
- Quick quiz works.
- Login history UI added.
- Error Message Handling for new auth flow

---

### Expected JSON Examples — Registration + Profile Completion

## 1. Registration Success Response

Endpoint:

`POST /api/v1/auth/register`

Expected response:

```json
{
  "status": true,
  "message": "تم تسجيلك بنجاح.",
  "code": "REGISTERED",
  "data": {
    "access_token": "28|uQx68q5AGLegmriKyaKwEQZXZhRBVag3E6bvOAfa9ec9adb4",
    "deeplink_token": "60e85f0288330bf23fa596e25f3e1d0882f3cf0fc947a0c2a5fe124563950533",
    "deeplink_expires_in": 60,
    "student": {
      "id": 11,
      "first_name": "Phase2",
      "last_name": "FrontendQA",
      "code_country": "20",
      "avatar": "<https://developer.admin.nir-edu.com/images/default/avatar.png>",
      "type": 1,
      "phone": "01082192999",
      "parent_phone": null,
      "state_id": null,
      "state_name": null,
      "city": null,
      "city_id": null,
      "created_at": "19/05/2026",
      "updated_at": "19/05/2026",
      "grade": 1,
      "grade_name": "first grade",
      "group_link": null,
      "points": 0,
      "student_phone_verification": true,
      "parent_phone_verification": false
    },
    "user_id": 11,
    "enrollments": [
      {
        "tenant_id": "071612b0-e180-4585-9f04-9e822f09fc8c",
        "name": "developer",
        "slug": "developer",
        "status": "active",
        "domain": "developer.admin.nir-edu.com",
        "domain_type": "subdomain",
        "primary_color": "#9b3b78",
        "tenant_status": 1,
        "tenant_user_id": 11,
        "source": "direct",
        "enrolled_at": "2026-05-19T12:13:28.000000Z",
        "last_accessed_at": null
      }
    ],
    "profile_completed": false,
    "missing_required": []
  },
  "errors": null
}
```

## 2. Profile Fields Response

Endpoint:

`GET /api/v1/student/profile/fields`

Expected response:

```json
{
  "status": true,
  "message": "Profile fields loaded successfully.",
  "code": "PROFILE_FIELDS_LOADED",
  "data": {
    "profile_completed": false,
    "missing_required": ["parent_phone", "state_id", "city_id", "school_name"],
    "fields": [
      {
        "key": "parent_phone",
        "label": "Parent Phone",
        "type": "phone",
        "required": true,
        "enabled": true,
        "value": null
      },
      {
        "key": "state_id",
        "label": "Governorate",
        "type": "select",
        "required": true,
        "enabled": true,
        "value": null
      },
      {
        "key": "city_id",
        "label": "City",
        "type": "select",
        "required": true,
        "enabled": true,
        "value": null
      },
      {
        "key": "school_name",
        "label": "School Name",
        "type": "text",
        "required": true,
        "enabled": true,
        "value": null
      },
      {
        "key": "whatsapp_number",
        "label": "WhatsApp Number",
        "type": "phone",
        "required": false,
        "enabled": true,
        "value": null
      }
    ]
  },
  "errors": null
}
```

---

## 3. Profile Completion Submit Response

Endpoint:

`POST /api/v1/student/profile/complete`

Request payload example:

```json
{
  "parent_phone": "01012345678",
  "state_id": 4,
  "city_id": 138,
  "school_name": "Future School",
  "whatsapp_number": "01012345678"
}
```

Expected success response:

```json
{
  "status": true,
  "message": "Profile completed successfully.",
  "code": "PROFILE_COMPLETED",
  "data": {
    "profile_completed": true,
    "missing_required": [],
    "student": {
      "id": 11,
      "first_name": "Phase2",
      "last_name": "FrontendQA",
      "phone": "01082192999",
      "parent_phone": "01012345678",
      "state_id": 4,
      "state_name": "الدقهلية",
      "city_id": 138,
      "city": "المنصورة",
      "school_name": "Future School",
      "whatsapp_number": "01012345678",
      "profile_completed": true,
      "profile_completed_at": "2026-05-19T12:45:00.000000Z"
    }
  },
  "errors": null
}
```

---

## 4. Profile Completion Validation Error

Expected error response:

```json
{
  "status": false,
  "message": "Please complete the required profile fields.",
  "code": "PROFILE_VALIDATION_ERROR",
  "data": {
    "profile_completed": false,
    "missing_required": ["parent_phone", "state_id"]
  },
  "errors": {
    "parent_phone": ["Parent phone is required."],
    "state_id": ["Governorate is required."]
  }
}
```

---

# Frontend Architecture

## Does frontend prepare UI for each input

Frontend should create one reusable component:

```
DynamicProfileForm
```

It receives backend fields:

```json
{
  "fields": [
    {
      "key": "father_phone",
      "label": "رقم هاتف الأب",
      "type": "phone",
      "required": true,
      "value": null
    },
    {
      "key": "student_type",
      "label": "نوع الحضور",
      "type": "select",
      "required": true,
      "value": 4,
      "options": [
        { "value": 4, "label": "أونلاين" },
        { "value": 3, "label": "حضوري / سنتر" },
        { "value": 5, "label": "طالب كود سنتر" }
      ]
    }
  ]
}
```

Then frontend renders based on `type`.

---

# Frontend Input Renderer Logic

```json
type = text       → normal input
type = phone      → phone input
type = select     → dropdown
type = date       → date picker
type = textarea   → textarea
type = email      → email input
```

Special cases:

```
state_id → governorate dropdown
city_id  → city dropdown depends on selected state
student_type → dropdown values from backend
```

So frontend does **not** hardcode all profile forms per tenant. It only needs a renderer.

---

# Dynamic Fields We Will Support

Extra fields tenant can enable/require:

```
parent_phone
father_phone
mother_phone
parent_name
father_name
mother_name
parent_job
father_job
mother_job
parent_email
whatsapp_number
state_id
city_id
school_name
gender
date_of_birth
national_id
address
student_type
branch
emergency_phone
email
```

Important:

```
student_type → users.type
all other profile fields → students table
```

---

# Student Type Values

Use existing constants:

```jsx
public const SUPER_STUDENT_ONLINE  = 4;
public const SUPER_STUDENT_OFFLINE = 3;
public const STUDENT_CODE_CENTER   = 5;
```

Frontend options:

```jsx
[
  { value: 4, label: "أونلاين" },
  { value: 3, label: "حضوري / سنتر" },
  { value: 5, label: "طالب كود سنتر" },
];
```
