import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { useQuery } from "@tanstack/react-query";

function CommentsFilter({
  setCourseId,
  setRoomId,
  setLessonId,
  courseId,
  roomId,
  lessonId,
  setPage,
}) {
  const { data: courses } = useQuery({
    queryKey: ["/students/courses/enrolled"],
    queryFn: getClientPrivateData,
  });

  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryFn: getClientPrivateData,
    queryKey: [`/students/get-rooms/${courseId}?page=1&per_page=10`],
    enabled: !!courseId && courseId !== "all",
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: [`/students/get-lessons/${roomId}?classroom_id=${courseId}`],
    queryFn: getClientPrivateData,
    enabled: !!roomId && roomId !== "all",
  });

  return (
    <div className="mt-[10px] grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3">
      <Select
        value={courseId || "all"}
        onValueChange={(val) => {
          setCourseId(val);
          setRoomId("all");
          setLessonId("all");
          setPage(1);
        }}
        dir="rtl"
      >
        <SelectTrigger>
          <SelectValue placeholder="اختر الكورس" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>اختر الكورس</SelectLabel>
            <SelectItem value={"all"}>كل الكورسات</SelectItem>
            {courses?.data?.map((course) => (
              <SelectItem key={course.id} value={String(course.id)}>
                {" "}
                {course.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={roomId || "all"}
        disabled={!courseId || courseId === "all"}
        onValueChange={(val) => {
          setRoomId(val);
          setLessonId("all");
          setPage(1);
        }}
        dir="rtl"
      >
        <SelectTrigger>
          <SelectValue placeholder="اختر الحصة" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>اختر الحصة</SelectLabel>
            <SelectItem value={"all"}>كل الحصص</SelectItem>
            {roomsLoading ? (
              <p className="text-sm">جاري التحميل ...</p>
            ) : (
              rooms?.body?.rooms?.map((room) => (
                <SelectItem key={room.id} value={String(room.id)}>
                  {room.title}
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={lessonId || "all"}
        disabled={!roomId || roomId === "all"}
        onValueChange={(val) => {
          setLessonId(val);
          setPage(1);
        }}
        dir="rtl"
      >
        <SelectTrigger>
          <SelectValue placeholder="اختر الدرس" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>اختر الدرس</SelectLabel>
            <SelectItem value={"all"}>كل الدروس</SelectItem>
            {lessonsLoading ? (
              <p className="text-sm">جاري التحميل ...</p>
            ) : (
              lessons?.body?.lessons?.map((lesson) => (
                <SelectItem key={lesson.id} value={String(lesson.id)}>
                  {lesson.title}
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default CommentsFilter;
