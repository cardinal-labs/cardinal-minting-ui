import { css } from '@emotion/react'
import { SocialIcon } from 'common/Socials'
import { useProjectConfig } from 'providers/ProjectConfigProvider'

export const MintInfo = () => {
  const { config } = useProjectConfig()
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex gap-6">
        {config.logoImage && (
          <img
            className="w-10"
            src={config.logoImage}
            alt={config.displayName}
          />
        )}
        <div className="bold text-6xl">{config.displayName}</div>
      </div>
      <div className="flex items-center gap-4 text-light-0">
        {config.socialLinks?.map(({ icon, link }, i) => {
          return (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noreferrer"
              className={`cursor-pointer text-xl text-light-0 transition-all duration-300 hover:text-primary`}
              css={css`
                &:hover {
                  color: ${config.colors.accent} !important;
                }
              `}
            >
              <SocialIcon iconKey={icon} />
            </a>
          )
        })}
      </div>
      <div className="whitespace-pre-line text-lg text-light-2">
        {config.description}
      </div>
    </div>
  )
}
