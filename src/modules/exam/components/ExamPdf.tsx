/* eslint-disable jsx-a11y/alt-text */
import {
  TaskAnswerOption,
  TaskChoiceAnswerQuestion,
  TaskEssayQuestion,
  TaskParagraphAnswerQuestion,
  TaskShowAnswersData,
  TaskShowAnswersQuestion,
} from "@/types/quiz.types";
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import Html from "react-pdf-html";

Font.register({
  family: "AvenirArabic",
  fonts: [
    { src: "/fonts/avenir-arabic/AvenirArabic-Light.otf", fontWeight: "light" },
    {
      src: "/fonts/avenir-arabic/AvenirArabic-Book.otf",
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      src: "/fonts/avenir-arabic/AvenirArabic-Medium.otf",
      fontWeight: "medium",
    },
    { src: "/fonts/avenir-arabic/AvenirArabic-Heavy.otf", fontWeight: "bold" },
  ],
});

// ─── Color Palette ────────────────────────────────────────────────────────────
const COLORS = {
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  primaryDark: "#1E40AF",
  success: "#16A34A",
  successLight: "#F0FDF4",
  successBorder: "#BBF7D0",
  danger: "#DC2626",
  dangerLight: "#FEF2F2",
  dangerBorder: "#FECACA",
  info: "#0891B2",
  infoLight: "#ECFEFF",
  infoBorder: "#A5F3FC",
  warning: "#D97706",
  warningLight: "#FFFBEB",
  warningBorder: "#FDE68A",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",
  white: "#FFFFFF",
  explanationBg: "#FFF7ED",
  explanationBorder: "#FDBA74",
  essayBg: "#F5F3FF",
  essayBorder: "#C4B5FD",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingBottom: 50,
    fontFamily: "AvenirArabic",
    backgroundColor: COLORS.white,
  },
  // ── Header ──
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: `2 solid ${COLORS.primary}`,
  },
  headerTopRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "right",
  },
  examTitle: {
    fontSize: 16,
    fontWeight: "medium",
    color: COLORS.gray800,
    marginBottom: 8,
    textAlign: "right",
  },
  // ── Score summary ──
  scoreSummaryRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
    border: `1 solid ${COLORS.gray200}`,
  },
  scoreCardLabel: {
    fontSize: 8,
    color: COLORS.gray500,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  scoreCardValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.white,
  },
  // ── Question Container ──
  questionContainer: {
    marginBottom: 14,
    borderRadius: 8,
    border: `1 solid ${COLORS.gray200}`,
    overflow: "hidden",
  },
  questionHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: COLORS.gray100,
    borderBottom: `1 solid ${COLORS.gray200}`,
  },
  questionHeaderRight: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  questionHeaderLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  questionNumberBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  questionNumberText: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.white,
  },
  questionScoreBadge: {
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  questionScoreText: {
    fontSize: 9,
    color: COLORS.gray600,
    fontWeight: "medium",
  },
  questionBody: {
    padding: 12,
    textAlign: "right",
  },
  questionTitleWrap: {
    marginBottom: 10,
    textAlign: "right",
  },
  // ── Status Badges ──
  notAnsweredBadge: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    border: `1 solid ${COLORS.dangerBorder}`,
  },
  notAnsweredText: {
    fontSize: 9,
    color: COLORS.danger,
    fontWeight: "medium",
  },
  correctAnswerBadge: {
    backgroundColor: COLORS.successLight,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    border: `1 solid ${COLORS.successBorder}`,
  },
  correctAnswerText: {
    fontSize: 9,
    color: COLORS.success,
    fontWeight: "medium",
  },
  wrongAnswerBadge: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    border: `1 solid ${COLORS.dangerBorder}`,
  },
  wrongAnswerText: {
    fontSize: 9,
    color: COLORS.danger,
    fontWeight: "medium",
  },
  multiCorrectBadge: {
    backgroundColor: COLORS.infoLight,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    border: `1 solid ${COLORS.infoBorder}`,
  },
  multiCorrectText: {
    fontSize: 9,
    color: COLORS.info,
    fontWeight: "medium",
  },
  // ── Answer Options ──
  answerOption: {
    flexDirection: "row-reverse",
    marginBottom: 6,
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    border: `1 solid ${COLORS.gray200}`,
  },
  answerOptionCorrectSelected: {
    backgroundColor: COLORS.successLight,
    border: `1.5 solid ${COLORS.success}`,
  },
  answerOptionCorrectMissed: {
    backgroundColor: COLORS.white,
    border: `1 dashed ${COLORS.success}`,
  },
  answerOptionWrong: {
    backgroundColor: COLORS.dangerLight,
    border: `1.5 solid ${COLORS.danger}`,
  },
  answerOptionDefault: {
    backgroundColor: COLORS.white,
  },
  answerIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  answerIndicatorText: {
    fontSize: 9,
    fontWeight: "bold",
    color: COLORS.white,
  },
  answerContent: {
    flex: 1,
    textAlign: "right",
  },
  answerText: {
    fontSize: 11,
    lineHeight: 1.4,
    color: COLORS.gray700,
    textAlign: "right",
  },
  answerTextCorrect: {
    color: COLORS.success,
    fontWeight: "medium",
  },
  answerTextWrong: {
    color: COLORS.danger,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
  },
  // ── Written / Essay Answer ──
  writtenAnswerSection: {
    marginTop: 10,
    borderRadius: 6,
    border: `1 solid ${COLORS.essayBorder}`,
    overflow: "hidden",
  },
  writtenAnswerHeader: {
    backgroundColor: COLORS.essayBg,
    padding: 8,
    borderBottom: `1 solid ${COLORS.essayBorder}`,
    textAlign: "right",
  },
  writtenAnswerHeaderText: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.gray700,
  },
  writtenAnswerBody: {
    padding: 10,
    backgroundColor: COLORS.white,
  },
  writtenAnswerText: {
    fontSize: 11,
    fontStyle: "italic",
    color: COLORS.gray600,
    lineHeight: 1.6,
    textAlign: "right",
  },
  noAnswerText: {
    fontSize: 11,
    fontStyle: "italic",
    color: COLORS.gray400,
  },
  // ── Explanation ──
  explanationSection: {
    marginTop: 12,
    borderRadius: 6,
    border: `1 solid ${COLORS.explanationBorder}`,
    overflow: "hidden",
  },
  explanationHeader: {
    backgroundColor: COLORS.explanationBg,
    padding: 8,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    borderBottom: `1 solid ${COLORS.explanationBorder}`,
  },
  explanationHeaderText: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.warning,
  },
  explanationBody: {
    padding: 10,
    backgroundColor: COLORS.white,
    fontSize: 11,
  },
  // ── Answer Video ──
  answerVideoSection: {
    marginTop: 8,
    padding: 8,
    backgroundColor: COLORS.infoLight,
    borderRadius: 6,
    border: `1 solid ${COLORS.infoBorder}`,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  answerVideoLabel: {
    fontSize: 9,
    color: COLORS.info,
    fontWeight: "bold",
  },
  answerVideoLink: {
    fontSize: 9,
    color: COLORS.primary,
    textDecoration: "underline",
  },
  // ── Paragraph ──
  paragraphTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.gray800,
    backgroundColor: COLORS.primaryLight,
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    border: `1 solid ${COLORS.gray200}`,
  },
  nestedQuestion: {
    marginRight: 12,
    marginTop: 6,
  },
  // ── Footer ──
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    color: COLORS.gray400,
  },
  // ── Essay Status ──
  essayStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  essayStatusText: {
    fontSize: 9,
    fontWeight: "medium",
  },
  // ── Attachment image ──
  attachmentImage: {
    width: "100%",
    marginTop: 8,
    maxHeight: 200,
    objectFit: "contain",
    objectPosition: "right",
    borderRadius: 4,
    border: `1 solid ${COLORS.gray200}`,
  },
});

// ─── HTML Stylesheets ────────────────────────────────────────────────────────
const htmlStylesheet = {
  p: {
    fontFamily: "AvenirArabic",
    margin: 0,
    padding: 0,
    textAlign: "right",
  },
  div: {
    fontFamily: "AvenirArabic",
  },
  span: {
    fontFamily: "AvenirArabic",
  },
  strong: {
    fontFamily: "AvenirArabic",
    fontWeight: "bold",
  },
  b: {
    fontFamily: "AvenirArabic",
    fontWeight: "bold",
  },
};

const questionTitleHtmlStyles = {
  ...htmlStylesheet,
  p: {
    ...htmlStylesheet.p,
    fontSize: 12,
    lineHeight: 1.5,
    color: COLORS.gray800,
  },
};

const paragraphTitleHtmlStyles = {
  ...htmlStylesheet,
  p: {
    ...htmlStylesheet.p,
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.gray800,
  },
};

const answerHtmlStyles = {
  ...htmlStylesheet,
  p: {
    ...htmlStylesheet.p,
    fontSize: 11,
    lineHeight: 1.4,
    color: COLORS.gray700,
  },
};

const successAnswerHtml = {
  ...htmlStylesheet,
  p: {
    ...htmlStylesheet.p,
    fontSize: 11,
    lineHeight: 1.4,
    color: COLORS.success,
    fontWeight: "medium",
  },
};

const wrongAnswerHtml = {
  ...htmlStylesheet,
  p: {
    ...htmlStylesheet.p,
    fontSize: 11,
    lineHeight: 1.4,
    color: COLORS.danger,
  },
};

const explanationHtmlStyles = {
  ...htmlStylesheet,
  p: {
    ...htmlStylesheet.p,
    lineHeight: 1.5,
    color: COLORS.gray700,
    fontSize: 11,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const renderHtml = (
  html?: string | null,
  customStylesheet = htmlStylesheet,
  fontSize?: number,
) => {
  if (!html) return null;

  const extractImages = (htmlString: string) => {
    const imgRegex = /<img\s+[^>]*?src=["']([^"']+)["'][^>]*?>/gi;
    const images: React.JSX.Element[] = [];
    let match;

    while ((match = imgRegex.exec(htmlString)) !== null) {
      const srcValue = match[1];
      // Base64 data URIs should be used directly, not proxied
      const finalSrc = srcValue.startsWith("data:")
        ? srcValue
        : srcValue.startsWith("/api/blob-proxy?url=")
          ? srcValue
          : `/api/blob-proxy?url=${encodeURIComponent(srcValue)}`;

      images.push(
        <Image
          key={`img-${images.length}`}
          src={finalSrc}
          style={{
            width: "100%",
            marginTop: 8,
            marginBottom: 8,
            maxHeight: 200,
            objectFit: "contain",
            objectPosition: "right",
            borderRadius: 4,
          }}
        />,
      );
    }

    return images;
  };

  const htmlWithoutImages = html.replace(
    /<img\s+[^>]*?src=["'][^"']+["'][^>]*?>/gi,
    "",
  );

  // Also strip <figure> wrappers that might be left empty after removing images
  const cleanedHtml = htmlWithoutImages.replace(
    /<figure[^>]*>\s*<\/figure>/gi,
    "",
  );

  const imageComponents = extractImages(html);

  return (
    <>
      {cleanedHtml.trim() && (
        <Html
          style={fontSize ? { fontSize } : undefined}
          stylesheet={customStylesheet}
        >
          {cleanedHtml}
        </Html>
      )}
      {imageComponents}
    </>
  );
};

const isValidUrl = (str?: string | null): boolean => {
  if (!str) return false;
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

// ─── Sub-Components ────────────────────────────────────────────────────────────

const RenderExplanation = ({
  explanation,
}: {
  explanation?: string | null;
}) => {
  if (!explanation) return null;

  return (
    <View style={styles.explanationSection}>
      <View style={styles.explanationHeader}>
        <Text style={styles.explanationHeaderText}> شرح الإجابة</Text>
      </View>
      <View style={styles.explanationBody}>
        {renderHtml(explanation, explanationHtmlStyles, 11)}
      </View>
    </View>
  );
};

const RenderAnswerVideo = ({
  answerVideo,
}: {
  answerVideo?: string | null;
}) => {
  if (!answerVideo) return null;

  return (
    <View style={styles.answerVideoSection} wrap={false}>
      <Text style={styles.answerVideoLabel}>فيديو الشرح:</Text>
      {isValidUrl(answerVideo) ? (
        <Link src={answerVideo}>
          <Text style={styles.answerVideoLink}>{answerVideo}</Text>
        </Link>
      ) : (
        <Text style={{ fontSize: 9, color: COLORS.gray500 }}>
          {answerVideo}
        </Text>
      )}
    </View>
  );
};

// ─── Render Functions ──────────────────────────────────────────────────────────

const renderMCQQuestion = (
  question: TaskChoiceAnswerQuestion,
  index: number,
  isSubquestion: boolean = false,
) => {
  const isAnswered = question.answers?.some((answer) => answer.selected);
  const isMultiple = question.has_multi_correct;

  // Determine if the answer is correct:
  // For single-correct: the selected answer must be the correct one
  // For multi-correct: all correct answers must be selected, and no wrong answers selected
  const isCorrectAnswer = isAnswered
    ? question.answers?.every(
        (answer) =>
          (answer.correct && answer.selected) ||
          (!answer.correct && !answer.selected),
      )
    : false;

  return (
    <View key={question.id} style={styles.questionContainer}>
      {/* Header */}
      <View style={styles.questionHeader} wrap={false}>
        <View style={styles.questionHeaderRight}>
          <View
            style={[
              styles.questionNumberBadge,
              isSubquestion && { backgroundColor: COLORS.gray700 },
            ]}
          >
            <Text style={styles.questionNumberText}>سؤال {index + 1}</Text>
          </View>
          {!!question.score && question.score > 0 && (
            <View style={styles.questionScoreBadge}>
              <Text style={styles.questionScoreText}>
                {question.score} درجة
              </Text>
            </View>
          )}
        </View>
        <View style={styles.questionHeaderLeft}>
          {!isAnswered ? (
            <View style={styles.notAnsweredBadge}>
              <Text style={styles.notAnsweredText}>
                لم تقم بالاجابة على هذا السؤال
              </Text>
            </View>
          ) : isCorrectAnswer ? (
            <View style={styles.correctAnswerBadge}>
              <Text style={styles.correctAnswerText}>إجابة صحيحة</Text>
            </View>
          ) : (
            <View style={styles.wrongAnswerBadge}>
              <Text style={styles.wrongAnswerText}>إجابة غير صحيحة</Text>
            </View>
          )}
          {isMultiple && (
            <View style={styles.multiCorrectBadge}>
              <Text style={styles.multiCorrectText}>
                هذا السؤال يحتوي على اكثر من اجابة
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Body */}
      <View style={styles.questionBody}>
        {/* Question Title */}
        <View style={styles.questionTitleWrap}>
          {renderHtml(question.title, questionTitleHtmlStyles)}
        </View>

        {/* Answer Options */}
        {question.answers?.map((answer: TaskAnswerOption, idx: number) => {
          const isCorrect = answer.correct;
          const isSelected = answer.selected;

          // Three-state styling:
          // 1. Correct + Selected  → solid green (user got it right)
          // 2. Correct + Missed    → dashed green outline (user missed this)
          // 3. Wrong  + Selected   → solid red (user picked wrong)
          // 4. Default              → neutral
          const optionStyle =
            isCorrect && isSelected
              ? styles.answerOptionCorrectSelected
              : isCorrect && !isSelected
                ? styles.answerOptionCorrectMissed
                : isSelected
                  ? styles.answerOptionWrong
                  : styles.answerOptionDefault;

          const indicatorBg =
            isCorrect && isSelected
              ? COLORS.success
              : isCorrect && !isSelected
                ? COLORS.success
                : isSelected
                  ? COLORS.danger
                  : COLORS.gray300;

          const textStyle =
            isCorrect && isSelected
              ? successAnswerHtml
              : isCorrect && !isSelected
                ? successAnswerHtml
                : isSelected
                  ? wrongAnswerHtml
                  : null;

          const letterLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];
          const label = letterLabels[idx] || `${idx + 1}`;

          // Status indicator: show dot when answer is correct, selected, or both
          const showStatusDot = isCorrect || isSelected;

          return (
            <View
              key={answer.id}
              style={[styles.answerOption, optionStyle]}
              wrap={false}
            >
              <View
                style={[
                  styles.answerIndicator,
                  { backgroundColor: indicatorBg },
                ]}
              >
                <Text style={styles.answerIndicatorText}>{label}</Text>
              </View>
              {showStatusDot && (
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: isCorrect
                        ? COLORS.success
                        : COLORS.danger,
                    },
                  ]}
                />
              )}
              <View style={styles.answerContent}>
                {answer.valueInput ? (
                  <Text
                    style={[
                      styles.answerText,
                      isCorrect && styles.answerTextCorrect,
                      isSelected && !isCorrect && styles.answerTextWrong,
                    ]}
                  >
                    {answer.valueInput}
                  </Text>
                ) : (
                  renderHtml(answer.valueCk, {
                    ...answerHtmlStyles,
                    ...textStyle,
                  })
                )}
              </View>
            </View>
          );
        })}

        {/* Answer Video */}
        <RenderAnswerVideo answerVideo={question.answer_video} />

        {/* Explanation */}
        <RenderExplanation explanation={question.explanation} />
      </View>
    </View>
  );
};

const renderParagraphQuestion = (
  question: TaskParagraphAnswerQuestion,
  index: number,
) => (
  <View key={question.id} style={styles.questionContainer}>
    {/* Header */}
    <View style={styles.questionHeader}>
      <View style={styles.questionHeaderRight}>
        <View style={[styles.questionNumberBadge]}>
          <Text style={styles.questionNumberText}>سؤال {index + 1}</Text>
        </View>
        <View
          style={[styles.questionNumberBadge, { backgroundColor: COLORS.info }]}
        >
          <Text style={styles.questionNumberText}>فقرة</Text>
        </View>
        {!!question.score && question.score > 0 && (
          <View style={styles.questionScoreBadge}>
            <Text style={styles.questionScoreText}>{question.score} درجة</Text>
          </View>
        )}
      </View>
    </View>

    {/* Body */}
    <View style={styles.questionBody}>
      {/* Paragraph Title */}
      <View style={styles.paragraphTitle}>
        {renderHtml(question.title, paragraphTitleHtmlStyles)}
      </View>

      {/* Nested Questions */}
      <View style={styles.nestedQuestion}>
        {question.related_questions?.map((relatedQ, idx) =>
          renderMCQQuestion(relatedQ, idx, true),
        )}
      </View>

      {/* Answer Video */}
      <RenderAnswerVideo answerVideo={question.answer_video} />

      {/* Explanation */}
      <RenderExplanation explanation={question.explanation} />
    </View>
  </View>
);

const renderWrittenQuestion = (question: TaskEssayQuestion, index: number) => {
  const isCorrect = question?.essay?.is_correct;
  const isGraded = question?.essay?.graded;

  return (
    <View key={question.id} style={styles.questionContainer}>
      {/* Header */}
      <View style={styles.questionHeader} wrap={false}>
        <View style={styles.questionHeaderRight}>
          <View style={[styles.questionNumberBadge]}>
            <Text style={styles.questionNumberText}>سؤال {index + 1}</Text>
          </View>
          <View
            style={[
              styles.questionNumberBadge,
              { backgroundColor: COLORS.info },
            ]}
          >
            <Text style={styles.questionNumberText}>مقالى</Text>
          </View>
          {!!question.score && question.score > 0 && (
            <View style={styles.questionScoreBadge}>
              <Text style={styles.questionScoreText}>
                {question.score} درجة
              </Text>
            </View>
          )}
        </View>

        {/* Essay status */}
        {isGraded ? (
          <View
            style={[
              styles.essayStatusBadge,
              {
                backgroundColor: isCorrect
                  ? COLORS.successLight
                  : COLORS.dangerLight,
                border: `1 solid ${isCorrect ? COLORS.successBorder : COLORS.dangerBorder}`,
              },
            ]}
          >
            <Text
              style={[
                styles.essayStatusText,
                { color: isCorrect ? COLORS.success : COLORS.danger },
              ]}
            >
              {isCorrect ? "إجابة صحيحة" : "إجابة غير صحيحة"}
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.essayStatusBadge,
              {
                backgroundColor: COLORS.warningLight,
                border: `1 solid ${COLORS.warningBorder}`,
              },
            ]}
          >
            <Text style={[styles.essayStatusText, { color: COLORS.warning }]}>
              قيد المراجعة
            </Text>
          </View>
        )}
      </View>

      {/* Body */}
      <View style={styles.questionBody}>
        {/* Question Title */}
        <View style={styles.questionTitleWrap}>
          {renderHtml(question.title, questionTitleHtmlStyles)}
        </View>

        {/* Student Answer */}
        <View style={styles.writtenAnswerSection}>
          <View style={styles.writtenAnswerHeader}>
            <Text style={styles.writtenAnswerHeaderText}>إجابة الطالب</Text>
          </View>
          <View style={styles.writtenAnswerBody}>
            {!!question?.essay?.text && question?.essay?.text !== "null" ? (
              <Text style={styles.writtenAnswerText}>
                {question.essay.text || ""}
              </Text>
            ) : (
              <Text style={styles.noAnswerText}>لم يتم تقديم إجابة</Text>
            )}

            {/* Student Attachments */}
            {question?.essay?.attachments?.map((attachment, idx) =>
              attachment?.url ? (
                <Image
                  key={`attachment-${idx}`}
                  src={`/api/blob-proxy?url=${attachment.url}`}
                  style={styles.attachmentImage}
                />
              ) : null,
            )}
          </View>
        </View>

        {/* Answer Video */}
        <RenderAnswerVideo answerVideo={question.answer_video} />

        {/* Explanation (includes images when available) */}
        <RenderExplanation explanation={question.explanation} />
      </View>
    </View>
  );
};

const renderQuestion = (question: TaskShowAnswersQuestion, index: number) => {
  if (question.type === 2) {
    return renderParagraphQuestion(question, index);
  } else if (question.type === 3) {
    return renderWrittenQuestion(question, index);
  } else {
    return renderMCQQuestion(question, index);
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ExamPDF = ({ examData }: { examData: TaskShowAnswersData }) => {
  const details = examData?.details;
  const isPassed = details?.result;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header} wrap={false}>
          <View style={styles.headerTopRow}>
            <Text style={styles.title}>نتيجة الإجابات</Text>
            {details && (
              <View
                style={[
                  styles.resultBadge,
                  {
                    backgroundColor: isPassed ? COLORS.success : COLORS.danger,
                  },
                ]}
              >
                <Text style={styles.resultBadgeText}>
                  {isPassed ? "ناجح" : "راسب"}
                </Text>
              </View>
            )}
          </View>

          {details?.title && (
            <Text style={styles.examTitle}>{details.title}</Text>
          )}

          {/* Score Summary Cards */}
          {details && (
            <View style={styles.scoreSummaryRow}>
              <View style={styles.scoreCard}>
                <Text style={styles.scoreCardLabel}>الدرجة</Text>
                <Text style={styles.scoreCardValue}>
                  {details.total_score} / {details.total_score_denominator}
                </Text>
              </View>
              <View style={styles.scoreCard}>
                <Text style={styles.scoreCardLabel}>النسبة</Text>
                <Text style={styles.scoreCardValue}>{details.score}%</Text>
              </View>
              <View style={styles.scoreCard}>
                <Text style={styles.scoreCardLabel}>عدد الأسئلة</Text>
                <Text style={styles.scoreCardValue}>
                  {examData?.questions?.length || 0}
                </Text>
              </View>
              {details.review_pending && (
                <View
                  style={[
                    styles.scoreCard,
                    {
                      backgroundColor: COLORS.warningLight,
                      border: `1 solid ${COLORS.warningBorder}`,
                    },
                  ]}
                >
                  <Text
                    style={[styles.scoreCardLabel, { color: COLORS.warning }]}
                  >
                    الحالة
                  </Text>
                  <Text
                    style={[
                      styles.scoreCardValue,
                      { color: COLORS.warning, fontSize: 10 },
                    ]}
                  >
                    قيد المراجعة
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* ── Questions ── */}
        {examData?.questions?.map((question, index) =>
          renderQuestion(question, index),
        )}

        {/* ── Page Number Footer ── */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default ExamPDF;
