import { useState, memo } from "react";
import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Typography,
  notification,
} from "antd";
import axios from "axios";
import { API_PATH } from "../../utils/apipath";
import { encryptPayload } from "../../utils/crypto";
import { IconPhone, IconMail, IconMapPin, IconSend } from "@tabler/icons-react";
import { IMAGES } from "../../utils/images";
import "./ContactSection.css";
import {
  CONTACT_EMAIL_ADDRESS,
  CONTACT_LOCATION,
  CONTACT_MOBILE_NUMBER_2,
  CONTACT_MOBILE_NUMBER_3,
  FORM_MESSAGES,
} from "../../utils/constants";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactSection = memo(() => {
  const [form] = Form.useForm<ContactFormValues>();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      //fetch public key
      const keyRes = await axios.get(API_PATH.GET_PUBLIC_KEY);
      const { keyId, publicKey } = keyRes.data;

      const payload = {
        siteId: import.meta.env.VITE_SITE_ID,
        formType: "contact",
        data: values,
      };

      const envelope = await encryptPayload(payload, keyId, publicKey);

      await axios.post(API_PATH.SUBMIT_CONTACT_FORM, envelope, {
        headers: {
          "Content-Type": "application/json",
          "X-Request-Id": "req-" + Math.floor(Math.random() * 1000000),
        },
      });

      setSubmitted(true);
      form.resetFields();
      notification.success({
        message: FORM_MESSAGES.SUCCESS_TITLE,
        description: FORM_MESSAGES.SUCCESS_DESCRIPTION,
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch (error) {
      console.error("Submission error:", error);
      notification.error({
        message: FORM_MESSAGES.ERROR_TITLE,
        description: FORM_MESSAGES.ERROR_DESCRIPTION,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <Row className="contact-row" gutter={[28, 24]} align="top">
          <Col xs={24} lg={9}>
            <div className="contact-left">
              <div className="contact-header">
                <Title level={2} className="title-card contact-title">
                  ENQUIRY / CONTACT US
                </Title>

                <div className="clients-title-divider">
                  <span className="clients-divider-line" />
                  <img
                    src={IMAGES.BRAND_LOGO}
                    alt=""
                    className="clients-divider-logo"
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="clients-divider-line" />
                </div>
              </div>

              <Title level={4} className="contact-main-title">
                We&apos;d Love to hear from you!
              </Title>

              <p className="section-subtitle" style={{ textAlign: "left" }}>
                Fill in the details and we'll get back to you.
              </p>

              {/* Contact Details */}
              <div className="contact-details">
                <div className="contact-detail">
                  <IconPhone
                    className="contact-detail-icon"
                    size={20}
                    stroke={1.5}
                  />
                  <Text className="contact-detail-text">
                    {CONTACT_MOBILE_NUMBER_2}
                    <Divider
                      orientation="vertical"
                      className="contact-phone-divider"
                    />
                    {CONTACT_MOBILE_NUMBER_3}
                  </Text>
                </div>

                <div className="contact-detail contact-detail-address">
                  <IconMail
                    className="contact-detail-icon"
                    size={20}
                    stroke={1.5}
                  />
                  <Text className="contact-detail-text">
                    {CONTACT_EMAIL_ADDRESS}
                  </Text>
                </div>

                <div className="contact-detail contact-detail-address">
                  <IconMapPin
                    className="contact-detail-icon"
                    size={20}
                    stroke={1.5}
                  />
                  <Text className="contact-detail-text">
                    {CONTACT_LOCATION}
                  </Text>
                </div>
              </div>
            </div>
          </Col>

          {/* CENTER - CONTACT FORM */}
          <Col xs={24} lg={10}>
            <Form
              form={form}
              layout="vertical"
              autoComplete="none"
              onFinish={handleSubmit}
              requiredMark={false}
              className="contact-form"
            >
              <Row gutter={12}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your name",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Your Name"
                      size="large"
                      maxLength={32}
                      autoComplete="new-password"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your phone number",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Phone Number"
                      size="large"
                      maxLength={20}
                      autoComplete="new-password"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col xs={24}>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your email",
                      },
                      {
                        type: "email",
                        message: "Please enter a valid email",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Email Address"
                      size="large"
                      maxLength={32}
                      autoComplete="new-password"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="message"
                rules={[
                  {
                    required: true,
                    message: "Please enter your message",
                  },
                ]}
              >
                <TextArea
                  placeholder="Your Message"
                  autoSize={{ minRows: 4 }}
                  maxLength={200}
                />
              </Form.Item>

              <Flex justify="center" style={{ marginTop: 8 }}>
                <Button
                  htmlType="submit"
                  type="primary"
                  loading={isSubmitting}
                  icon={
                    submitted ? undefined : <IconSend size={18} stroke={1.5} />
                  }
                  className="btn-primary"
                >
                  {submitted ? "Message Sent!" : "Send Enquiry"}
                </Button>
              </Flex>
            </Form>
          </Col>

          {/* RIGHT - UTENSIL IMAGE */}
          <Col xs={24} lg={5}>
            <div className="contact-image-wrapper">
              <Image
                preview={false}
                src={IMAGES.DIMPLE_ROSEI_UTENSIL}
                alt="Dimple's Rasoi Utensil"
                className="contact-image"
              />
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
});

ContactSection.displayName = "ContactSection";

export default ContactSection;
