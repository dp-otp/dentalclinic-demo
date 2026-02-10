/**
 * WOOPARCEL SERVICE MODAL
 *
 * Premium modal for service detail views with video, benefits, and upsells.
 *
 * USAGE IN FRAMER:
 * 1. Create new Code Component
 * 2. Paste this entire file
 * 3. Connect to service card clicks
 * 4. Pass service data via props
 */

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ============================================================================
// TOKENS
// ============================================================================

const TOKENS = {
  colors: {
    obsidian: "#0B0C0E",
    elevated: "#0F1113",
    elevated2: "#14161A",
    accent: "#D77A00",
    accentLight: "#E8943A",
    text: "#FFFFFF",
    textMuted: "#BFC6CC",
    border: "rgba(255, 255, 255, 0.06)",
    backdrop: "rgba(11, 12, 14, 0.9)",
  },
  easing: {
    smooth: [0.16, 1, 0.3, 1] as const,
    in: [0.4, 0, 1, 1] as const,
  },
}

// ============================================================================
// TYPES
// ============================================================================

interface ServiceData {
  id: string
  name: string
  tagline: string
  description: string
  benefits: string[]
  videoUrl?: string
  accentColor: string
  addon?: {
    name: string
    price: string
    description: string
    benefit: string
  }
}

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service: ServiceData | null
  onGetStarted?: (serviceId: string, addonSelected: boolean) => void
}

// ============================================================================
// MODAL COMPONENT
// ============================================================================

export function ServiceModal({
  isOpen,
  onClose,
  service,
  onGetStarted,
}: ServiceModalProps) {
  const [addonSelected, setAddonSelected] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Reset addon when modal opens
  useEffect(() => {
    if (isOpen) {
      setAddonSelected(false)
    }
  }, [isOpen])

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!service) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={handleBackdropClick}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: TOKENS.colors.backdrop,
            backdropFilter: "blur(12px)",
          }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{
              duration: 0.28,
              ease: TOKENS.easing.smooth,
            }}
            style={{
              width: "100%",
              maxWidth: 680,
              maxHeight: "90vh",
              overflowY: "auto",
              background: TOKENS.colors.elevated,
              borderRadius: 24,
              border: `1px solid ${TOKENS.colors.border}`,
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.6)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                width: 40,
                height: 40,
                borderRadius: 12,
                background: TOKENS.colors.elevated2,
                border: `1px solid ${TOKENS.colors.border}`,
                color: TOKENS.colors.textMuted,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = TOKENS.colors.accent
                e.currentTarget.style.color = TOKENS.colors.text
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = TOKENS.colors.elevated2
                e.currentTarget.style.color = TOKENS.colors.textMuted
              }}
            >
              ×
            </button>

            {/* Video / Visual */}
            {service.videoUrl && (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  background: TOKENS.colors.obsidian,
                  borderRadius: "24px 24px 0 0",
                  overflow: "hidden",
                }}
              >
                <video
                  src={service.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {/* Content */}
            <div style={{ padding: "32px 40px 40px" }}>
              {/* Header */}
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: TOKENS.colors.text,
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                {service.name}
              </h2>

              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: TOKENS.colors.textMuted,
                  margin: 0,
                  marginBottom: 32,
                }}
              >
                {service.description}
              </p>

              {/* Benefits */}
              <div style={{ marginBottom: 32 }}>
                <h3
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: TOKENS.colors.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: 0,
                    marginBottom: 16,
                  }}
                >
                  Key Benefits
                </h3>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {service.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        fontSize: 15,
                        color: TOKENS.colors.text,
                      }}
                    >
                      <span
                        style={{
                          color: service.accentColor || TOKENS.colors.accent,
                          fontWeight: 600,
                        }}
                      >
                        ✓
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Addon Upsell */}
              {service.addon && (
                <div
                  style={{
                    background: TOKENS.colors.elevated2,
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 32,
                    border: addonSelected
                      ? `2px solid ${TOKENS.colors.accent}`
                      : `1px solid ${TOKENS.colors.border}`,
                    cursor: "pointer",
                    transition: "all 0.28s",
                  }}
                  onClick={() => setAddonSelected(!addonSelected)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          border: `2px solid ${
                            addonSelected ? TOKENS.colors.accent : TOKENS.colors.border
                          }`,
                          background: addonSelected ? TOKENS.colors.accent : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s",
                        }}
                      >
                        {addonSelected && (
                          <span style={{ color: TOKENS.colors.obsidian, fontSize: 14 }}>✓</span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: TOKENS.colors.text,
                        }}
                      >
                        {service.addon.name}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: TOKENS.colors.accent,
                      }}
                    >
                      {service.addon.price}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: 14,
                      color: TOKENS.colors.textMuted,
                      margin: 0,
                      marginLeft: 36,
                    }}
                  >
                    {service.addon.description}
                  </p>

                  <p
                    style={{
                      fontSize: 13,
                      color: "#10B981",
                      margin: 0,
                      marginTop: 8,
                      marginLeft: 36,
                    }}
                  >
                    ✓ {service.addon.benefit}
                  </p>
                </div>
              )}

              {/* CTAs */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                }}
              >
                <motion.button
                  whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(215, 122, 0, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onGetStarted?.(service.id, addonSelected)}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${TOKENS.colors.accent} 0%, #B86A00 100%)`,
                    border: "none",
                    color: TOKENS.colors.text,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(215, 122, 0, 0.3)",
                  }}
                >
                  Get Started Free
                </motion.button>

                <motion.button
                  whileHover={{ y: -2, background: "rgba(255, 255, 255, 0.05)" }}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 12,
                    background: "transparent",
                    border: `1px solid ${TOKENS.colors.border}`,
                    color: TOKENS.colors.text,
                    fontSize: 16,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Talk to Sales
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// STANDALONE WRAPPER FOR FRAMER
// ============================================================================

interface ServiceModalStandaloneProps {
  serviceId: string
  serviceName: string
  serviceTagline: string
  serviceDescription: string
  serviceBenefits: string
  serviceVideoUrl?: string
  serviceAccentColor: string
  addonName?: string
  addonPrice?: string
  addonDescription?: string
  addonBenefit?: string
  isOpen: boolean
}

export function ServiceModalStandalone({
  serviceId = "smart-routing",
  serviceName = "Smart Routing",
  serviceTagline = "AI finds the best carrier every time",
  serviceDescription = "Our AI analyzes every shipment and selects the optimal carrier based on your priorities.",
  serviceBenefits = "Compares 15+ carriers\nSaves 40% on costs\nAuto-selects based on rules",
  serviceVideoUrl = "",
  serviceAccentColor = "#4ECDC4",
  addonName = "",
  addonPrice = "",
  addonDescription = "",
  addonBenefit = "",
  isOpen = false,
}: ServiceModalStandaloneProps) {
  const [open, setOpen] = useState(isOpen)

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const service: ServiceData = {
    id: serviceId,
    name: serviceName,
    tagline: serviceTagline,
    description: serviceDescription,
    benefits: serviceBenefits.split("\n").filter(Boolean),
    videoUrl: serviceVideoUrl || undefined,
    accentColor: serviceAccentColor,
    addon: addonName
      ? {
          name: addonName,
          price: addonPrice,
          description: addonDescription,
          benefit: addonBenefit,
        }
      : undefined,
  }

  return (
    <ServiceModal
      isOpen={open}
      onClose={() => setOpen(false)}
      service={service}
      onGetStarted={(id, addon) => console.log("Get started:", id, addon)}
    />
  )
}

// ============================================================================
// FRAMER PROPERTY CONTROLS
// ============================================================================

addPropertyControls(ServiceModalStandalone, {
  isOpen: {
    type: ControlType.Boolean,
    title: "Open",
    defaultValue: false,
  },
  serviceId: {
    type: ControlType.String,
    title: "ID",
    defaultValue: "smart-routing",
  },
  serviceName: {
    type: ControlType.String,
    title: "Name",
    defaultValue: "Smart Routing",
  },
  serviceTagline: {
    type: ControlType.String,
    title: "Tagline",
    defaultValue: "AI finds the best carrier every time",
  },
  serviceDescription: {
    type: ControlType.String,
    title: "Description",
    defaultValue: "Our AI analyzes every shipment...",
    displayTextArea: true,
  },
  serviceBenefits: {
    type: ControlType.String,
    title: "Benefits (newline separated)",
    defaultValue: "Compares 15+ carriers\nSaves 40% on costs",
    displayTextArea: true,
  },
  serviceVideoUrl: {
    type: ControlType.String,
    title: "Video URL",
    defaultValue: "",
  },
  serviceAccentColor: {
    type: ControlType.Color,
    title: "Accent",
    defaultValue: "#4ECDC4",
  },
  addonName: {
    type: ControlType.String,
    title: "Addon Name",
    defaultValue: "",
  },
  addonPrice: {
    type: ControlType.String,
    title: "Addon Price",
    defaultValue: "",
  },
  addonDescription: {
    type: ControlType.String,
    title: "Addon Description",
    defaultValue: "",
  },
  addonBenefit: {
    type: ControlType.String,
    title: "Addon Benefit",
    defaultValue: "",
  },
})

export default ServiceModalStandalone
