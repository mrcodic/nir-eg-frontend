import {
  Document,
  Font,
  Image,
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

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontFamily: "AvenirArabic",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    borderBottom: "2 solid #333333",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 5,
    fontWeight: "bold",
  },
  examTitle: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "medium",
  },
  subtitle: {
    fontSize: 12,
    color: "#666666",
  },
  questionContainer: {
    marginBottom: 10,
    padding: 10,
    border: "1 solid #cccccc",
    borderRadius: 5,
  },
  questionHeader: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 5,
    borderRadius: 3,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#333333",
  },
  questionTitle: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  answerOption: {
    flexDirection: "row",
    marginBottom: 8,
    marginLeft: 20,
    padding: 5,
    borderRadius: 3,
    alignItems: "center",
  },
  answerNumber: {
    fontSize: 11,
    marginRight: 10,
    color: "#523412",
    fontWeight: "bold",
  },
  answerContent: {
    flex: 1,
  },
  answerText: {
    fontSize: 11,
    lineHeight: 1.4,
  },
  didntAnswer: {
    fontSize: 11,
    lineHeight: 1.4,
    color: "red",
  },
  writtenAnswer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    border: "1 dashed #cccccc",
    flexDirection: "column",
    gap: 2,
  },
  writtenAnswerText: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#333",
  },
  paragraphTitle: {
    fontSize: 13,
    marginBottom: 15,
    fontWeight: "bold",
    color: "#333333",
    backgroundColor: "#e8f4f8",
    padding: 8,
    borderRadius: 3,
  },
  nestedQuestion: {
    marginLeft: 20,
    marginTop: 10,
  },
  readingBorder: {
    fontSize: 10,
    color: "#666666",
    marginVertical: 5,
    textAlign: "center",
  },
});

const htmlStylesheet = {
  p: {
    fontFamily: "AvenirArabic",
    margin: 0,
    padding: 0,
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
  },
};

const paragraphTitleHtmlStyles = {
  ...htmlStylesheet,
  p: {
    ...htmlStylesheet.p,
    fontSize: 13,
    fontWeight: "bold",
  },
};

const answerHtmlStyles = {
  ...htmlStylesheet,
  p: {
    ...htmlStylesheet.p,
    fontSize: 11,
    lineHeight: 1.4,
  },
};

const successAnswer = {
  ...htmlStylesheet,
  p: {
    ...htmlStylesheet.p,
    fontSize: 11,
    lineHeight: 1.4,
    color: "green",
  },
};

const wrongAnswer = {
  ...htmlStylesheet,
  p: {
    ...htmlStylesheet.p,
    fontSize: 11,
    lineHeight: 1.4,
    color: "red",
  },
};

const renderHtml = (html, customStylesheet = htmlStylesheet) => {
  if (!html) return null;

  const extractImages = (htmlString) => {
    const imgRegex = /<img\s+[^>]*?src=["']([^"']+)["'][^>]*?>/gi;
    const images = [];
    let match;

    while ((match = imgRegex.exec(htmlString)) !== null) {
      const srcValue = match[1];
      const finalSrc = srcValue.startsWith("/api/blob-proxy?url=")
        ? srcValue
        : `/api/blob-proxy?url=${encodeURIComponent(srcValue)}`;

      images.push(
        <Image
          key={`img-${images.length}`}
          src={finalSrc}
          style={{
            width: "100%",
            marginTop: 10,
            marginBottom: 10,
            maxHeight: "200px",
            objectFit: "contain",
            objectPosition: "left",
            borderRadius: 5,
          }}
        />
      );
    }

    return images;
  };

  const htmlWithoutImages = html.replace(
    /<img\s+[^>]*?src=["'][^"']+["'][^>]*?>/gi,
    ""
  );

  const imageComponents = extractImages(html);

  return (
    <>
      <Html stylesheet={customStylesheet}>{htmlWithoutImages}</Html>
      {imageComponents}
    </>
  );
};

const RenderExplaination = ({ explanation }) => {
  return (
    explanation && (
      <View style={{ marginTop: 20 }} wrap={false}>
        <Text style={styles.questionNumber}>Question Explaination</Text>
        <View>{renderHtml(explanation, questionTitleHtmlStyles)}</View>
      </View>
    )
  );
};

const renderMCQQuestion = (question, index) => {
  const isAnswered = question.answers?.some((answer) => answer.selected);
  const isMultiple = question.has_multi_correct;

  return (
    <View key={question.id} style={styles.questionContainer}>
      <View style={styles.questionHeader} wrap={false}>
        <Text style={styles.questionNumber}>Question {index + 1}</Text>
        {!isAnswered && (
          <Text style={styles.didntAnswer}>لم تقم بالاجابة على هذا السؤال</Text>
        )}
        {isAnswered && isMultiple && (
          <Text style={{ ...styles.didntAnswer, color: "blue" }}>
            هذا السؤال يحتوي على اكثر من اجابة
          </Text>
        )}
      </View>

      <View style={styles.row}>
        {renderHtml(question.title, questionTitleHtmlStyles)}
      </View>

      {question.answers?.map((answer, idx) => {
        const isCorrect = answer.correct;
        const isSelected = answer.selected;
        const answerStyle = isCorrect
          ? successAnswer
          : isSelected
          ? wrongAnswer
          : null;

        return (
          <View key={answer.id} style={styles.answerOption}>
            <Text style={{ ...styles.answerNumber, ...answerStyle }}>
              {idx + 1}.
            </Text>
            {(isCorrect || isSelected) && (
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: isCorrect ? "green" : "red",
                  marginRight: 5,
                }}
              />
            )}
            <View style={styles.answerContent}>
              {answer.valueInput ? (
                <Text style={{ ...styles.answerText, ...answerStyle }}>
                  {answer.valueInput}
                </Text>
              ) : (
                renderHtml(answer.valueCk, {
                  ...answerHtmlStyles,
                  ...answerStyle,
                })
              )}
            </View>
          </View>
        );
      })}

      {question?.explanation && (
        <RenderExplaination explanation={question?.explanation} />
      )}
    </View>
  );
};

const renderParagraphQuestion = (question, index) => (
  <View key={question.id} style={styles.questionContainer}>
    <View style={styles.questionHeader} wrap={false}>
      <Text style={styles.questionNumber}>Paragraph {index + 1}</Text>
    </View>

    <View style={styles.paragraphTitle}>
      {renderHtml(question.title, paragraphTitleHtmlStyles)}
    </View>

    <View style={styles.nestedQuestion}>
      {question.related_questions?.map((relatedQ, idx) =>
        renderMCQQuestion(relatedQ, idx)
      )}
    </View>

    {question?.explanation && (
      <RenderExplaination explanation={question?.explanation} />
    )}
  </View>
);

const renderWrittenQuestion = (question, index) => {
  const isCorrect = question?.essay?.is_correct;

  return (
    <View key={question.id} style={styles.questionContainer}>
      <View style={styles.questionHeader} wrap={false}>
        <Text style={styles.questionNumber}>Question {index + 1}</Text>
        {!isCorrect && <Text style={styles.didntAnswer}>اجابة غير صحيحة</Text>}
      </View>

      <View>{renderHtml(question.title, questionTitleHtmlStyles)}</View>

      <View style={styles.writtenAnswer}>
        <Text style={{ fontSize: 14, fontWeight: 600 }}>Student Answer:</Text>
        <Text style={styles.writtenAnswerText}>
          {question?.essay?.text || "No answer given!"}
        </Text>
        {question?.essay?.attachments?.[0]?.url && (
          <Image
            src={`/api/blob-proxy?url=${question?.essay?.attachments?.[0]?.url}`}
            style={{ width: "100%", marginTop: 10 }}
          />
        )}
      </View>

      {question?.explanation && (
        <RenderExplaination explanation={question?.explanation} />
      )}
    </View>
  );
};

const renderQuestion = (question, index) => {
  if (question.type === 2) {
    return renderParagraphQuestion(question, index);
  } else if (question.type === 3) {
    return renderWrittenQuestion(question, index);
  } else {
    return renderMCQQuestion(question, index);
  }
};

const ExamPDF = ({ examData }) => {
  console.log("examData , ", examData);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} wrap={false}>
          <Text style={styles.title}>Answers</Text>
          {examData?.details?.title && (
            <Text style={styles.examTitle}>{examData?.details?.title}</Text>
          )}
          <Text style={styles.subtitle}>
            Total Questions: {examData?.questions?.length || 0} | Score:{" "}
            {examData?.details?.score || 0}
          </Text>
        </View>
        {examData?.questions?.map((question, index) =>
          renderQuestion(question, index)
        )}
      </Page>
    </Document>
  );
};

export default ExamPDF;
