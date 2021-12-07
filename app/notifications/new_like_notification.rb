class NewLikeNotification < Noticed::Base

  deliver_by :database

  param :object

  def message
    "<strong>#{params[:user].user_username}</strong> liked your Post"
  end

  def url
    post_path(params[:object])
  end
end
